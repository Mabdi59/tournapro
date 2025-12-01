# WebSocket Backend Implementation Guide

## Overview
This guide explains how to add WebSocket support to your Spring Boot backend for real-time updates in TournaPro.

## 1. Add Dependencies

Add to your `pom.xml`:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-websocket</artifactId>
</dependency>
```

## 2. WebSocket Configuration

Create `WebSocketConfig.java`:

```java
package com.tournapro.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic");
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }
}
```

## 3. WebSocket Security Configuration

Update your `SecurityConfig.java`:

```java
@Override
public void configure(WebSecurityCustomizer web) throws Exception {
    web.ignoring().antMatchers("/ws/**");
}
```

## 4. Message Models

Create `WebSocketMessage.java`:

```java
package com.tournapro.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WebSocketMessage {
    private String type;
    private Object payload;
}
```

Create specific payload classes:

```java
// MatchUpdatePayload.java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MatchUpdatePayload {
    private Long tournamentId;
    private Match match;
}

// TournamentUpdatePayload.java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TournamentUpdatePayload {
    private Tournament tournament;
}

// TeamUpdatePayload.java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TeamUpdatePayload {
    private Long tournamentId;
    private String action; // "created", "updated", "deleted"
    private Team team;
    private Long teamId; // for deleted
}

// PlayerUpdatePayload.java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlayerUpdatePayload {
    private Long teamId;
    private String action;
    private Player player;
}

// RegistrationUpdatePayload.java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationUpdatePayload {
    private Long tournamentId;
    private String teamName;
}
```

## 5. WebSocket Service

Create `WebSocketService.java`:

```java
package com.tournapro.service;

import com.tournapro.model.*;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WebSocketService {
    
    private final SimpMessagingTemplate messagingTemplate;

    public void sendMatchUpdate(Long tournamentId, Match match) {
        MatchUpdatePayload payload = new MatchUpdatePayload(tournamentId, match);
        WebSocketMessage message = new WebSocketMessage("MATCH_UPDATE", payload);
        messagingTemplate.convertAndSend("/topic/tournaments/" + tournamentId, message);
    }

    public void sendTournamentUpdate(Tournament tournament) {
        TournamentUpdatePayload payload = new TournamentUpdatePayload(tournament);
        WebSocketMessage message = new WebSocketMessage("TOURNAMENT_UPDATE", payload);
        messagingTemplate.convertAndSend("/topic/tournaments/" + tournament.getId(), message);
    }

    public void sendTeamUpdate(Long tournamentId, String action, Team team, Long teamId) {
        TeamUpdatePayload payload = new TeamUpdatePayload(tournamentId, action, team, teamId);
        WebSocketMessage message = new WebSocketMessage("TEAM_UPDATE", payload);
        messagingTemplate.convertAndSend("/topic/tournaments/" + tournamentId, message);
    }

    public void sendPlayerUpdate(Long teamId, String action, Player player) {
        PlayerUpdatePayload payload = new PlayerUpdatePayload(teamId, action, player);
        WebSocketMessage message = new WebSocketMessage("PLAYER_UPDATE", payload);
        messagingTemplate.convertAndSend("/topic/teams/" + teamId, message);
    }

    public void sendRegistrationUpdate(Long tournamentId, String teamName) {
        RegistrationUpdatePayload payload = new RegistrationUpdatePayload(tournamentId, teamName);
        WebSocketMessage message = new WebSocketMessage("REGISTRATION_UPDATE", payload);
        messagingTemplate.convertAndSend("/topic/tournaments/" + tournamentId, message);
    }
}
```

## 6. Update Your Controllers/Services

### MatchController - Add WebSocket notifications

```java
@Autowired
private WebSocketService webSocketService;

@PutMapping("/{id}/result")
public ResponseEntity<Match> updateMatchResult(
    @PathVariable Long id,
    @RequestBody MatchResultDto resultDto
) {
    Match match = matchService.updateResult(id, resultDto);
    
    // Send WebSocket notification
    webSocketService.sendMatchUpdate(match.getTournament().getId(), match);
    
    return ResponseEntity.ok(match);
}

@PutMapping("/{id}/schedule")
public ResponseEntity<Match> scheduleMatch(
    @PathVariable Long id,
    @RequestBody MatchScheduleDto scheduleDto
) {
    Match match = matchService.scheduleMatch(id, scheduleDto);
    
    // Send WebSocket notification
    webSocketService.sendMatchUpdate(match.getTournament().getId(), match);
    
    return ResponseEntity.ok(match);
}
```

### TournamentController - Add WebSocket notifications

```java
@Autowired
private WebSocketService webSocketService;

@PutMapping("/{id}/status")
public ResponseEntity<Tournament> updateStatus(
    @PathVariable Long id,
    @RequestBody StatusUpdateDto statusDto
) {
    Tournament tournament = tournamentService.updateStatus(id, statusDto.getStatus());
    
    // Send WebSocket notification
    webSocketService.sendTournamentUpdate(tournament);
    
    return ResponseEntity.ok(tournament);
}
```

### TeamController - Add WebSocket notifications

```java
@Autowired
private WebSocketService webSocketService;

@PostMapping
public ResponseEntity<Team> createTeam(@RequestBody TeamDto teamDto) {
    Team team = teamService.createTeam(teamDto);
    
    // Send WebSocket notification
    webSocketService.sendTeamUpdate(team.getTournament().getId(), "created", team, null);
    webSocketService.sendRegistrationUpdate(team.getTournament().getId(), team.getName());
    
    return ResponseEntity.ok(team);
}

@PutMapping("/{id}")
public ResponseEntity<Team> updateTeam(
    @PathVariable Long id,
    @RequestBody TeamDto teamDto
) {
    Team team = teamService.updateTeam(id, teamDto);
    
    // Send WebSocket notification
    webSocketService.sendTeamUpdate(team.getTournament().getId(), "updated", team, null);
    
    return ResponseEntity.ok(team);
}

@DeleteMapping("/{id}")
public ResponseEntity<Void> deleteTeam(@PathVariable Long id) {
    Team team = teamService.getTeamById(id);
    Long tournamentId = team.getTournament().getId();
    
    teamService.deleteTeam(id);
    
    // Send WebSocket notification
    webSocketService.sendTeamUpdate(tournamentId, "deleted", null, id);
    
    return ResponseEntity.noContent().build();
}
```

### PlayerController - Add WebSocket notifications

```java
@Autowired
private WebSocketService webSocketService;

@PostMapping
public ResponseEntity<Player> createPlayer(@RequestBody PlayerDto playerDto) {
    Player player = playerService.createPlayer(playerDto);
    
    // Send WebSocket notification
    webSocketService.sendPlayerUpdate(player.getTeam().getId(), "created", player);
    
    return ResponseEntity.ok(player);
}

@PutMapping("/{id}")
public ResponseEntity<Player> updatePlayer(
    @PathVariable Long id,
    @RequestBody PlayerDto playerDto
) {
    Player player = playerService.updatePlayer(id, playerDto);
    
    // Send WebSocket notification
    webSocketService.sendPlayerUpdate(player.getTeam().getId(), "updated", player);
    
    return ResponseEntity.ok(player);
}

@DeleteMapping("/{id}")
public ResponseEntity<Void> deletePlayer(@PathVariable Long id) {
    Player player = playerService.getPlayerById(id);
    Long teamId = player.getTeam().getId();
    
    playerService.deletePlayer(id);
    
    // Send WebSocket notification
    webSocketService.sendPlayerUpdate(teamId, "deleted", null);
    
    return ResponseEntity.noContent().build();
}
```

## 7. Testing the WebSocket

1. Start your Spring Boot backend
2. Start the React frontend (already running on port 5174)
3. Open multiple browser tabs with the same tournament
4. Update a match result in one tab
5. See the real-time update appear in all tabs instantly!

## 8. CORS Configuration (if needed)

If you encounter CORS issues, update your `WebSocketConfig`:

```java
@Override
public void registerStompEndpoints(StompEndpointRegistry registry) {
    registry.addEndpoint("/ws")
            .setAllowedOriginPatterns("http://localhost:5173", "http://localhost:5174", "http://localhost:*")
            .withSockJS();
}
```

## Summary

**What to add:**
1. ✅ WebSocket dependency in pom.xml
2. ✅ WebSocketConfig.java
3. ✅ Update SecurityConfig to allow /ws/** endpoint
4. ✅ Create WebSocketMessage and payload models
5. ✅ Create WebSocketService
6. ✅ Update controllers to send WebSocket notifications after data changes

**Frontend is already complete!** 🎉

The frontend automatically:
- Connects to WebSocket when user logs in
- Listens for real-time updates
- Updates UI instantly when data changes
- Shows "Live" status indicator
- Auto-reconnects if connection drops
