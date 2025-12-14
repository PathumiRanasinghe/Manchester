package com.university.service;

import jakarta.enterprise.context.ApplicationScoped;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.representations.idm.UserRepresentation;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.RolesResource;
import org.keycloak.admin.client.CreatedResponseUtil;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.core.Response;

@ApplicationScoped
public class KeycloakAdminClient {

        private final Keycloak keycloak = KeycloakBuilder.builder()
            .serverUrl("http://localhost:8080")
            .realm("university")
            .clientId("university-backend")
            .clientSecret("ONDaFcND5Z3CwHwc9zo7XSddMRWnyuu7")
            .username("admin")
            .password("123")
            .build();

    public void createUserAndAssignRole(String fName, String lName,String email, String password, String roleName) {
        RealmResource realmResource = keycloak.realm("university");
        UsersResource usersResource = realmResource.users();

        UserRepresentation user = new UserRepresentation();
        user.setUsername(email);
        user.setEmail(email);
        user.setFirstName(fName);
        user.setLastName(lName);
        user.setEnabled(true);

        try {
            Response response = usersResource.create(user);
            if (response.getStatus() != 201) {
                throw new RuntimeException("Failed to create user in Keycloak: " + response.getStatusInfo());
            }

            String userId = CreatedResponseUtil.getCreatedId(response);

            CredentialRepresentation credential = new CredentialRepresentation();
            credential.setType(CredentialRepresentation.PASSWORD);
            credential.setValue(password);
            credential.setTemporary(false);

            UserResource userResource = usersResource.get(userId);
            userResource.resetPassword(credential);

            RolesResource rolesResource = realmResource.roles();
            RoleRepresentation role = rolesResource.get(roleName).toRepresentation();

            userResource.roles().realmLevel().add(java.util.Collections.singletonList(role));

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Keycloak user creation failed: " + e.getMessage(), e);
        }
    }

    public void deleteUserByUsername(String username) {
        RealmResource realmResource = keycloak.realm("university");
        UsersResource usersResource = realmResource.users();
        System.out.println("Attempting to delete user with username/email: " + username);
        java.util.List<UserRepresentation> users = usersResource.search(username, true);
        System.out.println("Search results count: " + users.size());
        if (users.isEmpty()) {
            System.out.println("No user found with username/email: " + username);
            return;
        }
        String userId = users.get(0).getId();
        System.out.println("Deleting user with userId: " + userId);
        try {
            usersResource.delete(userId);
            System.out.println("User deleted successfully in Keycloak.");
        } catch (NotFoundException e) {
            System.out.println("User not found in Keycloak during deletion: " + userId);
        } catch (Exception e) {
            System.out.println("Exception during Keycloak user deletion: " + e.getMessage());
            e.printStackTrace();
        }
    }

}
