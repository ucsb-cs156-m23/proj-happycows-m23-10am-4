package edu.ucsb.cs156.happiercows.strategies;

import edu.ucsb.cs156.happiercows.entities.Commons;
import edu.ucsb.cs156.happiercows.entities.UserCommons;
import edu.ucsb.cs156.happiercows.entities.User;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class CowHealthUpdateStrategyTests {

    @Test
    void get_name_and_description() {
        assertEquals("Linear", CowHealthUpdateStrategies.Linear.name());
        assertEquals("Linear", CowHealthUpdateStrategies.Linear.getDisplayName());
        assertEquals("Cow health increases/decreases proportionally to the number of cows over/under the carrying capacity.", CowHealthUpdateStrategies.Linear.getDescription());
    }


    Commons commons = Commons.builder()
            .degradationRate(0.01)
            .carryingCapacity(100)
            .build();
    User user = User.builder().build();
    UserCommons uc = UserCommons.builder().cowHealth(50).user(user).build();

    @Test
    void linear_updates_health_proportional_to_num_cows_over_capacity() {
        var formula = CowHealthUpdateStrategies.Linear;

        assertEquals(49.9, formula.calculateNewCowHealth(commons, uc, 110));
        assertEquals(50.0, formula.calculateNewCowHealth(commons, uc, 100));
        assertEquals(50.1, formula.calculateNewCowHealth(commons, uc, 90));
    }

    @Test
    void constant_changes_by_constant_amount() {
        var formula = CowHealthUpdateStrategies.Constant;

        assertEquals(49.99, formula.calculateNewCowHealth(commons, uc, 120));
        assertEquals(49.99, formula.calculateNewCowHealth(commons, uc, 110));
        assertEquals(50.01, formula.calculateNewCowHealth(commons, uc, 100));
        assertEquals(50.01, formula.calculateNewCowHealth(commons, uc, 90));
    }

    @Test
    void noop_does_nothing() {
        var formula = CowHealthUpdateStrategies.Noop;

        assertEquals(50.0, formula.calculateNewCowHealth(commons, uc, 110));
        assertEquals(50.0, formula.calculateNewCowHealth(commons, uc, 100));
        assertEquals(50.0, formula.calculateNewCowHealth(commons, uc, 90));
    }
}
