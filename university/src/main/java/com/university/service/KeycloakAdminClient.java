package com.university.service;

import jakarta.enterprise.context.ApplicationScoped;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import jakarta.inject.Inject;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
import java.io.OutputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

@ApplicationScoped
public class KeycloakAdminClient {
    private final String keycloakUrl = "http://localhost:8080";
    private final String realm = "university";
    private final String clientId = "admin-cli";

    @Inject
    @ConfigProperty(name = "keycloak.admin.username")
    String adminUsername;

    @Inject
    @ConfigProperty(name = "keycloak.admin.password")
    String adminPassword;

    public String getAdminToken() throws Exception {
        URL url = new URI(keycloakUrl + "/realms/" + realm + "/protocol/openid-connect/token").toURL();
        String body = "grant_type=password&client_id=" + clientId + "&username=" + adminUsername + "&password=" + adminPassword;
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setDoOutput(true);
        conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
        try (OutputStream os = conn.getOutputStream()) {
            os.write(body.getBytes(StandardCharsets.UTF_8));
        }
        try (InputStream is = conn.getInputStream()) {
            String json = new String(is.readAllBytes(), StandardCharsets.UTF_8);
            int start = json.indexOf("\"access_token\":\"") + 16;
            int end = json.indexOf('"', start);
            return json.substring(start, end);
        }
    }

    public void createUserAndAssignRole(String token,String fName, String lName, String username, String email, String password, String roleName) throws Exception {
    
        URL url = new URI(keycloakUrl + "/admin/realms/" + realm + "/users").toURL();
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setDoOutput(true);
        conn.setRequestProperty("Authorization", "Bearer " + token);
        conn.setRequestProperty("Content-Type", "application/json");
        String firstName = fName;
        String lastName = lName;
        String userJson = "{" +
                "\"username\":\"" + username + "\"," +
                "\"email\":\"" + email + "\"," +
                "\"firstName\":\"" + firstName + "\"," +
                "\"lastName\":\"" + lastName + "\"," +
                "\"enabled\":true," +
                "\"credentials\":[{" +
                "\"type\":\"password\",\"value\":\"" + password + "\",\"temporary\":false}]}";
        try (OutputStream os = conn.getOutputStream()) {
            os.write(userJson.getBytes(StandardCharsets.UTF_8));
        }
        int responseCode = conn.getResponseCode();
        if (responseCode != 201) throw new RuntimeException("Failed to create user in Keycloak");


        URL getUserUrl = new URI(keycloakUrl + "/admin/realms/" + realm + "/users?username=" + username).toURL();
        HttpURLConnection getUserConn = (HttpURLConnection) getUserUrl.openConnection();
        getUserConn.setRequestMethod("GET");
        getUserConn.setRequestProperty("Authorization", "Bearer " + token);
        int getUserResponseCode = getUserConn.getResponseCode();
        if (getUserResponseCode != 200) throw new RuntimeException("Failed to fetch user after creation");
        String userListJson;
        try (InputStream is = getUserConn.getInputStream()) {
            userListJson = new String(is.readAllBytes(), StandardCharsets.UTF_8);
        }
            String userId = null;
            int idIndex = userListJson.indexOf("\"id\":\"");
        if (idIndex != -1) {
                int idStart = idIndex + 6;
            int idEnd = userListJson.indexOf('"', idStart);
            userId = userListJson.substring(idStart, idEnd);
        }
        if (userId == null) throw new RuntimeException("User ID not found after creation");


        URL getRolesUrl = new URI(keycloakUrl + "/admin/realms/" + realm + "/roles/" + roleName).toURL();
        HttpURLConnection getRoleConn = (HttpURLConnection) getRolesUrl.openConnection();
        getRoleConn.setRequestMethod("GET");
        getRoleConn.setRequestProperty("Authorization", "Bearer " + token);
        int getRoleResponseCode = getRoleConn.getResponseCode();
        if (getRoleResponseCode != 200) throw new RuntimeException("Failed to fetch role info");
        String roleJson;
        try (InputStream is = getRoleConn.getInputStream()) {
            roleJson = new String(is.readAllBytes(), StandardCharsets.UTF_8);
        }
            String roleId = null;
            int roleIdIndex = roleJson.indexOf("\"id\":\"");
        if (roleIdIndex != -1) {
                int roleIdStart = roleIdIndex + 6;
            int roleIdEnd = roleJson.indexOf('"', roleIdStart);
            roleId = roleJson.substring(roleIdStart, roleIdEnd);
        }
        if (roleId == null) throw new RuntimeException("Role ID not found");

        URL assignRoleUrl = new URI(keycloakUrl + "/admin/realms/" + realm + "/users/" + userId + "/role-mappings/realm").toURL();
        HttpURLConnection assignRoleConn = (HttpURLConnection) assignRoleUrl.openConnection();
        assignRoleConn.setRequestMethod("POST");
        assignRoleConn.setDoOutput(true);
        assignRoleConn.setRequestProperty("Authorization", "Bearer " + token);
        assignRoleConn.setRequestProperty("Content-Type", "application/json");
        String assignRoleJson = "[{\"id\":\"" + roleId + "\",\"name\":\"" + roleName + "\"}]";
        try (OutputStream os = assignRoleConn.getOutputStream()) {
            os.write(assignRoleJson.getBytes(StandardCharsets.UTF_8));
        }
        int assignRoleResponseCode = assignRoleConn.getResponseCode();
        if (assignRoleResponseCode != 204) throw new RuntimeException("Failed to assign role to user");
    }

    public void deleteUserByUsername(String token, String username) throws Exception {

    URL getUserUrl = new URI(keycloakUrl + "/admin/realms/" + realm + "/users?username=" + username).toURL();
    HttpURLConnection getUserConn = (HttpURLConnection) getUserUrl.openConnection();
    getUserConn.setRequestMethod("GET");
    getUserConn.setRequestProperty("Authorization", "Bearer " + token);
    int getUserResponseCode = getUserConn.getResponseCode();
    if (getUserResponseCode != 200) throw new RuntimeException("Failed to fetch user for deletion");
    String userListJson;
    try (InputStream is = getUserConn.getInputStream()) {
        userListJson = new String(is.readAllBytes(), StandardCharsets.UTF_8);
    }
    String userId = null;
    int idIndex = userListJson.indexOf("\"id\":\"");
    if (idIndex != -1) {
        int idStart = idIndex + 6;
        int idEnd = userListJson.indexOf('"', idStart);
        userId = userListJson.substring(idStart, idEnd);
    }
    if (userId == null) throw new RuntimeException("User ID not found for deletion");


    URL deleteUrl = new URI(keycloakUrl + "/admin/realms/" + realm + "/users/" + userId).toURL();
    HttpURLConnection deleteConn = (HttpURLConnection) deleteUrl.openConnection();
    deleteConn.setRequestMethod("DELETE");
    deleteConn.setRequestProperty("Authorization", "Bearer " + token);
    int deleteResponseCode = deleteConn.getResponseCode();
    if (deleteResponseCode != 204) throw new RuntimeException("Failed to delete user in Keycloak");
}

    }

