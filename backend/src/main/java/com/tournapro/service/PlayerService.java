package com.tournapro.service;

import com.tournapro.dto.PlayerRequest;
import com.tournapro.dto.PlayerResponse;
import com.tournapro.entity.Player;
import com.tournapro.entity.Team;
import com.tournapro.repository.PlayerRepository;
import com.tournapro.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PlayerService {

    private final PlayerRepository playerRepository;
    private final TeamRepository teamRepository;

    @Transactional(readOnly = true)
    public List<PlayerResponse> getPlayersByTeam(Long teamId) {
        List<Player> players = playerRepository.findByTeamId(teamId);
        return players.stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PlayerResponse> getPlayersByTournament(Long tournamentId) {
        List<Player> players = playerRepository.findByTournamentId(tournamentId);
        return players.stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PlayerResponse getPlayerById(Long id) {
        Player player = playerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Player not found with id: " + id));
        return convertToResponse(player);
    }

    public PlayerResponse createPlayer(Long teamId, PlayerRequest request) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found with id: " + teamId));

        if (request.getJerseyNumber() != null) {
            Player existing = playerRepository.findByTeamIdAndJerseyNumber(teamId, request.getJerseyNumber());
            if (existing != null) {
                throw new RuntimeException("Jersey number " + request.getJerseyNumber() + " is already taken");
            }
        }

        Player player = new Player();
        player.setName(request.getName());
        player.setJerseyNumber(request.getJerseyNumber());
        player.setPosition(request.getPosition());
        player.setEmail(request.getEmail());
        player.setPhoneNumber(request.getPhoneNumber());
        player.setTeam(team);

        Player saved = playerRepository.save(player);
        return convertToResponse(saved);
    }

    public PlayerResponse updatePlayer(Long id, PlayerRequest request) {
        Player player = playerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Player not found with id: " + id));

        if (request.getJerseyNumber() != null &&
                !request.getJerseyNumber().equals(player.getJerseyNumber())) {
            Player existing = playerRepository.findByTeamIdAndJerseyNumber(
                    player.getTeam().getId(), request.getJerseyNumber());
            if (existing != null && !existing.getId().equals(id)) {
                throw new RuntimeException("Jersey number " + request.getJerseyNumber() + " is already taken");
            }
        }

        player.setName(request.getName());
        player.setJerseyNumber(request.getJerseyNumber());
        player.setPosition(request.getPosition());
        player.setEmail(request.getEmail());
        player.setPhoneNumber(request.getPhoneNumber());

        Player updated = playerRepository.save(player);
        return convertToResponse(updated);
    }

    public void deletePlayer(Long id) {
        if (!playerRepository.existsById(id)) {
            throw new RuntimeException("Player not found with id: " + id);
        }
        playerRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<PlayerResponse> getTopScorers(Long tournamentId, int limit) {
        List<Player> players = playerRepository.findTopScorersByTournament(tournamentId);
        return players.stream()
                .limit(limit)
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public PlayerResponse updatePlayerStats(Long id, Integer goals, Integer assists,
                                            Integer yellowCards, Integer redCards) {
        Player player = playerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Player not found with id: " + id));

        // Make sure existing values are treated as 0 if null
        int currentGoals = player.getGoals() != null ? player.getGoals() : 0;
        int currentAssists = player.getAssists() != null ? player.getAssists() : 0;
        int currentYellow = player.getYellowCards() != null ? player.getYellowCards() : 0;
        int currentRed = player.getRedCards() != null ? player.getRedCards() : 0;

        if (goals != null) player.setGoals(currentGoals + goals);
        if (assists != null) player.setAssists(currentAssists + assists);
        if (yellowCards != null) player.setYellowCards(currentYellow + yellowCards);
        if (redCards != null) player.setRedCards(currentRed + redCards);

        int finalGoals = player.getGoals() != null ? player.getGoals() : 0;
        int finalAssists = player.getAssists() != null ? player.getAssists() : 0;
        player.setPoints(finalGoals * 2 + finalAssists);

        Player updated = playerRepository.save(player);
        return convertToResponse(updated);
    }

    private PlayerResponse convertToResponse(Player player) {
        PlayerResponse response = new PlayerResponse();
        response.setId(player.getId());
        response.setName(player.getName());
        response.setJerseyNumber(player.getJerseyNumber());
        response.setPosition(player.getPosition());
        response.setEmail(player.getEmail());
        response.setPhoneNumber(player.getPhoneNumber());
        response.setTeamId(player.getTeam().getId());
        response.setTeamName(player.getTeam().getName());
        response.setGamesPlayed(player.getGamesPlayed());
        response.setGoals(player.getGoals());
        response.setAssists(player.getAssists());
        response.setYellowCards(player.getYellowCards());
        response.setRedCards(player.getRedCards());
        response.setPoints(player.getPoints());
        response.setCreatedAt(player.getCreatedAt());
        response.setUpdatedAt(player.getUpdatedAt());
        return response;
    }
}
