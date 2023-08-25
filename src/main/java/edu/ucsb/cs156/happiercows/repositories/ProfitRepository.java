package edu.ucsb.cs156.happiercows.repositories;

import edu.ucsb.cs156.happiercows.entities.Profit;
import edu.ucsb.cs156.happiercows.entities.UserCommons;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProfitRepository extends CrudRepository<Profit, Long> {
    // Caller should check if userCommons.getUser() is hidden
    Iterable<Profit> findAllByUserCommons(UserCommons userCommons);
}
