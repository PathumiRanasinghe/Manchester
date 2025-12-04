package com.university.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.core.Response;
import java.util.HashMap;
import java.util.Map;
import java.net.HttpURLConnection;
import java.net.URL;
import java.io.OutputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

@ApplicationScoped
public class KeycloakAdminClient {
    private final String keycloakUrl = "http://localhost:8080";
    private final String realm = "university";
    private final String clientId = "admin-cli";
    private final String adminUsername = "admin1";
    private final String adminPassword = "123";

    public String getAdminToken() throws Exception {
        URL url = new URL(keycloakUrl + "/realms/" + realm + "/protocol/openid-connect/token");
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

    public void createUserAndAssignRole(String token, String username, String email, String password, String roleName) throws Exception {
        // 1. Create user
        URL url = new URL(keycloakUrl + "/admin/realms/" + realm + "/users");
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setDoOutput(true);
        conn.setRequestProperty("Authorization", "Bearer " + token);
        conn.setRequestProperty("Content-Type", "application/json");
        String firstName = username;
        String lastName = username;
        if (email != null && email.contains("@")) {
            String[] parts = email.split("@");
            if (parts[0].contains(".")) {
                String[] names = parts[0].split("\\.");
                if (names.length >= 2) {
                    firstName = names[0];
                    lastName = names[1];
                }
            }
        }
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

        // 2. Get user ID
        URL getUserUrl = new URL(keycloakUrl + "/admin/realms/" + realm + "/users?username=" + username);
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

        // 3. Get role ID
        URL getRolesUrl = new URL(keycloakUrl + "/admin/realms/" + realm + "/roles/" + roleName);
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

        // 4. Assign role to user
        URL assignRoleUrl = new URL(keycloakUrl + "/admin/realms/" + realm + "/users/" + userId + "/role-mappings/realm");
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
    }

