package edu.ucsb.cs156.happiercows.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import edu.ucsb.cs156.happiercows.entities.Commons;
import edu.ucsb.cs156.happiercows.entities.CommonsPlus;
import edu.ucsb.cs156.happiercows.entities.User;
import edu.ucsb.cs156.happiercows.entities.UserCommons;
import edu.ucsb.cs156.happiercows.errors.EntityNotFoundException;
import edu.ucsb.cs156.happiercows.errors.UserHiddenException;
import edu.ucsb.cs156.happiercows.models.CreateCommonsParams;
import edu.ucsb.cs156.happiercows.models.HealthUpdateStrategyList;
import edu.ucsb.cs156.happiercows.repositories.CommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.UserCommonsRepository;
import edu.ucsb.cs156.happiercows.strategies.CowHealthUpdateStrategies;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Tag(name = "Commons")
@RequestMapping("/api/commons")
@RestController
public class CommonsController extends ApiController {
    @Autowired
    private CommonsRepository commonsRepository;

    @Autowired
    private UserCommonsRepository userCommonsRepository;

    @Autowired
    ObjectMapper mapper;

    @Operation(summary = "Get a list of all commons")
    @GetMapping("/all")
    public ResponseEntity<String> getCommons() throws JsonProcessingException {
        log.info("getCommons()...");
        Iterable<Commons> commons = commonsRepository.findAll();
        String body = mapper.writeValueAsString(commons);
        return ResponseEntity.ok().body(body);
    }

    @Operation(summary = "Get a list of all commons and number of cows/users")
    @GetMapping("/allplus")
    public ResponseEntity<String> getCommonsPlus() throws JsonProcessingException {
        log.info("getCommonsPlus()...");
        Iterable<Commons> commonsListIter = commonsRepository.findAll();

        // convert Iterable to List for the purposes of using a Java Stream & lambda
        // below
        List<Commons> commonsList = new ArrayList<Commons>();
        commonsListIter.forEach(commonsList::add);

        List<CommonsPlus> commonsPlusList1 = commonsList.stream()
                .map(c -> toCommonsPlus(c))
                .collect(Collectors.toList());

        ArrayList<CommonsPlus> commonsPlusList = new ArrayList<CommonsPlus>(commonsPlusList1);

        String body = mapper.writeValueAsString(commonsPlusList);
        return ResponseEntity.ok().body(body);
    }

    @Operation(summary = "Get the number of cows/users in a commons")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/plus")
    public CommonsPlus getCommonsPlusById(
            @Parameter(name="id") @RequestParam long id) throws JsonProcessingException {
            if (getCurrentUser().getUser().isHidden()) {
                throw new UserHiddenException(getCurrentUser().getUser().getId());
            }

                CommonsPlus commonsPlus = toCommonsPlus(commonsRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(Commons.class, id)));

        return commonsPlus;
    }

    @Operation(summary = "Update a commons")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/update")
    public ResponseEntity<String> updateCommons(
            @Parameter(name="commons identifier") @RequestParam long id,
            @Parameter(name="request body") @RequestBody CreateCommonsParams params
    ) {
        Optional<Commons> existing = commonsRepository.findById(id);

        Commons updated;
        HttpStatus status;

        if (existing.isPresent()) {
            updated = existing.get();
            status = HttpStatus.NO_CONTENT;
        } else {
            updated = new Commons();
            status = HttpStatus.CREATED;
        }

        updated.setName(params.getName());
        updated.setCowPrice(params.getCowPrice());
        updated.setMilkPrice(params.getMilkPrice());
        updated.setStartingBalance(params.getStartingBalance());
        updated.setStartingDate(params.getStartingDate());
        updated.setShowLeaderboard(params.getShowLeaderboard());
        updated.setDegradationRate(params.getDegradationRate());
        updated.setCarryingCapacity(params.getCarryingCapacity());
        if (params.getAboveCapacityHealthUpdateStrategy() != null) {
            updated.setAboveCapacityHealthUpdateStrategy(CowHealthUpdateStrategies.valueOf(params.getAboveCapacityHealthUpdateStrategy()));
        }
        if (params.getBelowCapacityHealthUpdateStrategy() != null) {
            updated.setBelowCapacityHealthUpdateStrategy(CowHealthUpdateStrategies.valueOf(params.getBelowCapacityHealthUpdateStrategy()));
        }

        if (params.getDegradationRate() < 0) {
            throw new IllegalArgumentException("Degradation Rate cannot be negative");
        }

        commonsRepository.save(updated);

        return ResponseEntity.status(status).build();
    }

    @Operation(summary = "Get a specific commons")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("")
    public Commons getCommonsById(
            @Parameter(name="id") @RequestParam Long id) throws JsonProcessingException {
        if (getCurrentUser().getUser().isHidden()) {
            throw new UserHiddenException(getCurrentUser().getUser().getId());
        }

        Commons commons = commonsRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(Commons.class, id));

        return commons;
    }

    @Operation(summary = "Create a new commons")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping(value = "/new", produces = "application/json")
    public ResponseEntity<String> createCommons(
            @Parameter(name="request body") @RequestBody CreateCommonsParams params
    ) throws JsonProcessingException {

        var builder = Commons.builder()
                .name(params.getName())
                .cowPrice(params.getCowPrice())
                .milkPrice(params.getMilkPrice())
                .startingBalance(params.getStartingBalance())
                .startingDate(params.getStartingDate())
                .degradationRate(params.getDegradationRate())
                .showLeaderboard(params.getShowLeaderboard())
                .carryingCapacity(params.getCarryingCapacity());

        // ok to set null values for these, so old backend still works
        if (params.getAboveCapacityHealthUpdateStrategy() != null) {
            builder.aboveCapacityHealthUpdateStrategy(CowHealthUpdateStrategies.valueOf(params.getAboveCapacityHealthUpdateStrategy()));
        }
        if (params.getBelowCapacityHealthUpdateStrategy() != null) {
            builder.belowCapacityHealthUpdateStrategy(CowHealthUpdateStrategies.valueOf(params.getBelowCapacityHealthUpdateStrategy()));
        }

        Commons commons = builder.build();


        // throw exception for degradation rate
        if (params.getDegradationRate() < 0) {
            throw new IllegalArgumentException("Degradation Rate cannot be negative");
        }

        Commons saved = commonsRepository.save(commons);
        String body = mapper.writeValueAsString(saved);

        return ResponseEntity.ok().body(body);
    }


    @Operation(summary = "List all cow health update strategies")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/all-health-update-strategies")
    public ResponseEntity<String> listCowHealthUpdateStrategies() throws JsonProcessingException {
        if (getCurrentUser().getUser().isHidden()) {
            throw new UserHiddenException(getCurrentUser().getUser().getId());
        }
        var result = HealthUpdateStrategyList.create();
        String body = mapper.writeValueAsString(result);
        return ResponseEntity.ok().body(body);
    }

    @Operation(summary = "Join a commons")
    @PreAuthorize("hasRole('ROLE_USER')")
    @PostMapping(value = "/join", produces = "application/json")
    public ResponseEntity<String> joinCommon(
            @Parameter(name="commonsId") @RequestParam Long commonsId) throws Exception {
        if (getCurrentUser().getUser().isHidden()) {
            throw new UserHiddenException(getCurrentUser().getUser().getId());
        }

        User u = getCurrentUser().getUser();
        Long userId = u.getId();
        String username = u.getFullName();

        Commons joinedCommons = commonsRepository.findById(commonsId)
                .orElseThrow(() -> new EntityNotFoundException(Commons.class, commonsId));
        Optional<UserCommons> userCommonsLookup = userCommonsRepository.findByCommonsIdAndUserId(commonsId, userId);

        if (userCommonsLookup.isPresent()) {
            // user is already a member of this commons
            String body = mapper.writeValueAsString(joinedCommons);
            return ResponseEntity.ok().body(body);
        }

        UserCommons uc = UserCommons.builder()
                .user(u)
                .commons(joinedCommons)
                .username(username)
                .totalWealth(joinedCommons.getStartingBalance())
                .numOfCows(0)
                .cowHealth(100)
                .cowsBought(0)
                .cowsSold(0)
                .cowDeaths(0)
                .build();

        userCommonsRepository.save(uc);

        String body = mapper.writeValueAsString(joinedCommons);
        return ResponseEntity.ok().body(body);
    }

    @Operation(summary = "Delete a Commons")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("")
    public Object deleteCommons(
            @Parameter(name="id") @RequestParam Long id) {

        commonsRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(Commons.class, id));

        commonsRepository.deleteById(id);

        String responseString = String.format("commons with id %d deleted", id);
        return genericMessage(responseString);

    }

    @Operation(summary="Delete a user from a commons")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/{commonsId}/users/{userId}")
    public Object deleteUserFromCommon(@PathVariable("commonsId") Long commonsId,
                                       @PathVariable("userId") Long userId) throws Exception {

        UserCommons userCommons = userCommonsRepository.findByCommonsIdAndUserId(commonsId, userId)
                .orElseThrow(() -> new EntityNotFoundException(
                        UserCommons.class, "commonsId", commonsId, "userId", userId)
                );

        userCommonsRepository.delete(userCommons);

        String responseString = String.format("user with id %d deleted from commons with id %d, %d users remain", userId, commonsId, commonsRepository.getNumNonHiddenUsers(commonsId).orElse(0));

        return genericMessage(responseString);
    }

    public CommonsPlus toCommonsPlus(Commons c) {
        Optional<Integer> numCows = commonsRepository.getNumCows(c.getId());
        Optional<Integer> numUsers = commonsRepository.getNumNonHiddenUsers(c.getId());

        return CommonsPlus.builder()
                .commons(c)
                .totalCows(numCows.orElse(0))
                .totalUsers(numUsers.orElse(0))
                .build();
    }
}
