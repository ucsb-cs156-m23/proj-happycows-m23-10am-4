package edu.ucsb.cs156.happiercows.controllers;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import edu.ucsb.cs156.happiercows.ControllerTestCase;
import edu.ucsb.cs156.happiercows.entities.User;
import edu.ucsb.cs156.happiercows.repositories.UserRepository;
import edu.ucsb.cs156.happiercows.testconfig.TestConfig;

import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;


import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;

@WebMvcTest(controllers = UsersController.class)
@Import(TestConfig.class)
@AutoConfigureDataJpa
public class UsersControllerTests extends ControllerTestCase {

  @MockBean
  UserRepository userRepository;

  @Test
  public void users__logged_out() throws Exception {
    mockMvc.perform(get("/api/admin/users"))
        .andExpect(status().is(403));
  }

  @WithMockUser(roles = { "USER" })
  @Test
  public void users__user_logged_in() throws Exception {
    mockMvc.perform(get("/api/admin/users"))
        .andExpect(status().is(403));
  }

  @WithMockUser(roles = { "ADMIN" })
  @Test
  public void users__admin_logged_in() throws Exception {

    
    // arrange

    User u1 = User.builder().id(1L).build();
    User u2 = User.builder().id(2L).build();
    User u = currentUserService.getCurrentUser().getUser();

    ArrayList<User> expectedUsers = new ArrayList<>();
    expectedUsers.addAll(Arrays.asList(u1, u2, u));

    when(userRepository.findAll()).thenReturn(expectedUsers);
    String expectedJson = mapper.writeValueAsString(expectedUsers);

    // act

    MvcResult response = mockMvc.perform(get("/api/admin/users"))
        .andExpect(status().isOk()).andReturn();

    // assert

    verify(userRepository, times(1)).findAll();
    String responseString = response.getResponse().getContentAsString();
    assertEquals(expectedJson, responseString);

  }

  @WithMockUser(roles = { "ADMIN" })
  @Test
  public void test_hide_non_exsitent_user() throws Exception {
    MvcResult response = mockMvc
            .perform(put("/api/admin/user/hide?userId=1337").with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .characterEncoding("utf-8"))
            .andExpect(status().isNotFound())
            .andReturn();
    
    Map<String, Object> responseMap = responseToJson(response);

    assertEquals(responseMap.get("message"), "User with id 1337 not found");
    assertEquals(responseMap.get("type"), "EntityNotFoundException");
  }

  @WithMockUser(roles = { "ADMIN" })
  @Test
  public void test_unhide_non_exsitent_user() throws Exception {
    MvcResult response = mockMvc
            .perform(put("/api/admin/user/unhide?userId=1337").with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .characterEncoding("utf-8"))
            .andExpect(status().isNotFound())
            .andReturn();
    
    Map<String, Object> responseMap = responseToJson(response);

    assertEquals(responseMap.get("message"), "User with id 1337 not found");
    assertEquals(responseMap.get("type"), "EntityNotFoundException");
  }

  @WithMockUser(roles = { "ADMIN" })
  @Test
  public void test_hide_user() throws Exception {
    User u = User.builder().id(1L).build();
    when(userRepository.findById(1L)).thenReturn(java.util.Optional.of(u));

    MvcResult response = mockMvc
            .perform(put("/api/admin/user/hide?userId=1").with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .characterEncoding("utf-8"))
            .andExpect(status().isOk())
            .andReturn();
    // response = "{}"
    assertEquals(response.getResponse().getContentAsString(), "{}");
    
    verify(userRepository, times(1)).findById(1L);
    verify(userRepository, times(1)).save(u);
    assertEquals(u.isHidden(), true);
    
    response = mockMvc
            .perform(put("/api/admin/user/unhide?userId=1").with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .characterEncoding("utf-8"))
            .andExpect(status().isOk())
            .andReturn();
    
    assertEquals(response.getResponse().getContentAsString(), "{}");
    verify(userRepository, times(2)).findById(1L);
    verify(userRepository, times(2)).save(u);
    assertEquals(u.isHidden(), false);
  }
}
