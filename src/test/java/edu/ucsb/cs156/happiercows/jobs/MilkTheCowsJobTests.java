package edu.ucsb.cs156.happiercows.jobs;

import edu.ucsb.cs156.happiercows.entities.Commons;
import edu.ucsb.cs156.happiercows.entities.User;
import edu.ucsb.cs156.happiercows.entities.UserCommons;
import edu.ucsb.cs156.happiercows.entities.jobs.Job;
import edu.ucsb.cs156.happiercows.repositories.CommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.ProfitRepository;
import edu.ucsb.cs156.happiercows.repositories.UserCommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.UserRepository;
import edu.ucsb.cs156.happiercows.services.jobs.JobContext;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.MockedConstruction;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.mockStatic;

@ExtendWith(SpringExtension.class)
@ContextConfiguration
public class MilkTheCowsJobTests {
    @Mock
    CommonsRepository commonsRepository;

    @Mock
    UserCommonsRepository userCommonsRepository;

    @Mock
    UserRepository userRepository;

    @Mock
    ProfitRepository profitRepository;

    private User user = User
            .builder()
            .id(1L)
            .fullName("Chris Gaucho")
            .email("cgaucho@example.org")
            .build();

    private Commons testCommons = Commons
            .builder()
            .name("test commons")
            .cowPrice(10)
            .milkPrice(2)
            .startingBalance(300)
            .startingDate(LocalDateTime.now())
            .carryingCapacity(100)
            .degradationRate(0.01)
            .build();

        private User hiddenUser = User
                                .builder()
                                .id(2L)
                                .fullName("Hidden User")
                                .email("test@ucsb.edu")
                                .isHidden(true)
                                .build();


    @Test
    void test_log_output_no_commons() throws Exception {

        // Arrange

        Job jobStarted = Job.builder().build();
        JobContext ctx = new JobContext(null, jobStarted);

        // Act
        MilkTheCowsJob milkTheCowsJob = new MilkTheCowsJob(commonsRepository, userCommonsRepository,
                userRepository, profitRepository);

        milkTheCowsJob.accept(ctx);

        // Assert

        String expected = """
                Starting to milk the cows
                Cows have been milked!""";

        assertEquals(expected, jobStarted.getLog());
    }

    @Test
    void test_log_output_with_commons_and_user_commons() throws Exception {

        // Arrange
        Job jobStarted = Job.builder().build();
        JobContext ctx = new JobContext(null, jobStarted);

        UserCommons origUserCommons = UserCommons
                .builder()
                .user(user)
                .commons(testCommons)
                .totalWealth(300)
                .numOfCows(1)
                .cowHealth(10)
                .build();

        when(commonsRepository.findAll()).thenReturn(Arrays.asList(testCommons));
        when(userCommonsRepository.findByCommonsId(testCommons.getId()))
                .thenReturn(Arrays.asList(origUserCommons));
        when(commonsRepository.getNumCows(testCommons.getId())).thenReturn(Optional.of(Integer.valueOf(1)));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        // Act
        MilkTheCowsJob MilkTheCowsJob = new MilkTheCowsJob(commonsRepository, userCommonsRepository,
                userRepository, profitRepository);
        MilkTheCowsJob.accept(ctx);

        // Assert

        String expected = """
                Starting to milk the cows
                Milking cows for Commons: test commons, Milk Price: $2.00
                User: Chris Gaucho, numCows: 1, cowHealth: 10.0, totalWealth: $300.00
                Profit for user: Chris Gaucho is: $0.20, newWealth: $300.20
                Cows have been milked!""";

        assertEquals(expected, jobStarted.getLog());
    }

    @Test
    void test_milk_cows() throws Exception {

        // Arrange
        Job jobStarted = Job.builder().build();
        JobContext ctx = new JobContext(null, jobStarted);

        UserCommons origUserCommons = UserCommons
                .builder()
                .user(user)
                .commons(testCommons)
                .totalWealth(300)
                .numOfCows(1)
                .cowHealth(10)
                .build();

        UserCommons updatedUserCommons = UserCommons
                .builder()
                .user(user)
                .commons(testCommons)
                .totalWealth(300.20)
                .numOfCows(1)
                .cowHealth(10)
                .build();

        Commons commonsTemp[] = {testCommons};
        UserCommons userCommonsTemp[] = {origUserCommons};
        when(commonsRepository.findAll()).thenReturn(Arrays.asList(commonsTemp));
        when(userCommonsRepository.findByCommonsId(testCommons.getId()))
                .thenReturn(Arrays.asList(userCommonsTemp));
        when(commonsRepository.getNumCows(testCommons.getId())).thenReturn(Optional.of(Integer.valueOf(1)));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userCommonsRepository.save(updatedUserCommons)).thenReturn(updatedUserCommons);


        // Act
        MilkTheCowsJob milkTheCowsJob = new MilkTheCowsJob(commonsRepository, userCommonsRepository,
                userRepository, profitRepository);
        milkTheCowsJob.milkCows(ctx, testCommons, origUserCommons);

        // Assert

        String expected = """
                User: Chris Gaucho, numCows: 1, cowHealth: 10.0, totalWealth: $300.00
                Profit for user: Chris Gaucho is: $0.20, newWealth: $300.20""";

        verify(userCommonsRepository).save(updatedUserCommons);
        assertEquals(expected, jobStarted.getLog());
    }

    @Test
    void test_milk_cows_user_hidden() throws Exception {
        Job jobStarted = Job.builder().build();
        JobContext ctx = new JobContext(null, jobStarted);

        UserCommons hiddenUserCommons = UserCommons
                .builder()
                .user(hiddenUser)
                .commons(testCommons)
                .totalWealth(300)
                .numOfCows(1)
                .cowHealth(10)
                .build();

        MilkTheCowsJob milkTheCowsJob = new MilkTheCowsJob(commonsRepository, userCommonsRepository,
                userRepository, profitRepository);
        
        milkTheCowsJob.milkCows(ctx, testCommons, hiddenUserCommons);

        verify(commonsRepository, times(0)).save(any());
        verify(userCommonsRepository, times(0)).save(any());
        verify(userRepository, times(0)).save(any());
        verify(profitRepository, times(0)).save(any());
    }

    @Test
    void test_milk_cows_job_user_hidden() throws Exception {
        Job jobStarted = Job.builder().build();
        JobContext ctx = new JobContext(null, jobStarted);

        UserCommons hiddenUserCommons = UserCommons
                .builder()
                .user(hiddenUser)
                .commons(testCommons)
                .totalWealth(300)
                .numOfCows(1)
                .cowHealth(10)
                .build();
        
        UserCommons normalUserCommons = UserCommons
                .builder()
                .user(user)
                .commons(testCommons)
                .totalWealth(300)
                .numOfCows(1)
                .cowHealth(10)
                .build();

        when(commonsRepository.save(testCommons)).thenReturn(testCommons);

        when(userCommonsRepository.save(hiddenUserCommons)).thenReturn(hiddenUserCommons);
        when(userCommonsRepository.save(normalUserCommons)).thenReturn(normalUserCommons);

        Commons commonsTemp[] = {testCommons};
        UserCommons userCommonsTemp[] = {hiddenUserCommons, normalUserCommons};

        when(commonsRepository.findAll()).thenReturn(Arrays.asList(commonsTemp));
        when(userCommonsRepository.findByCommonsId(testCommons.getId())).thenReturn(Arrays.asList(userCommonsTemp));

        MilkTheCowsJob MilkTheCowsJob = new MilkTheCowsJob(commonsRepository, userCommonsRepository,
                userRepository, profitRepository);
        MilkTheCowsJob.accept(ctx);

        verify(commonsRepository, times(0)).save(any());
        verify(userCommonsRepository, times(1)).save(any());
        verify(userRepository, times(0)).save(any());
        verify(profitRepository, times(1)).save(any());
    }
}