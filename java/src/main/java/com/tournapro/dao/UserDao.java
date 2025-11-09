package com.tournapro.dao;

import com.tournapro.model.RegisterUserDto;
import com.tournapro.model.User;

import java.util.List;

public interface UserDao {

    List<User> getUsers();

    User getUserById(int id);

    User getUserByUsername(String username);

    User createUser(RegisterUserDto user);
}
