package edu.ucsb.cs156.happiercows.repositories;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;

import edu.ucsb.cs156.happiercows.entities.Commons;


@Repository
public interface CommonsRepository extends CrudRepository<Commons, Long> {
    // Notice: This is non-hidden number of cows
    @Query("SELECT sum(uc.numOfCows) from user_commons uc where uc.commons.id = :commonsId AND uc.user.isHidden = false")
    Optional<Integer> getNumCows(Long commonsId);

    @Query("SELECT COUNT(*) FROM user_commons uc WHERE uc.commons.id = :commonsId AND uc.user.isHidden = false")
    Optional<Integer> getNumNonHiddenUsers(Long commonsId);

    @Query("SELECT COUNT(*) FROM user_commons uc WHERE uc.commons.id = :commonsId AND uc.user.isHidden = true")
    Optional<Integer> getNumHiddenUsers(Long commonsId);
}
