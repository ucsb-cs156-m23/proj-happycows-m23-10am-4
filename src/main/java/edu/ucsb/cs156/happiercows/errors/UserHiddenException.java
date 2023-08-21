package edu.ucsb.cs156.happiercows.errors;

public class UserHiddenException extends RuntimeException {
    public UserHiddenException(long userId) {
        super("User with id " + userId + " is hidden");
    }
}
