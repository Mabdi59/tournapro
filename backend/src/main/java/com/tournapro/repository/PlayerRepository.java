package com.tournapro.repository;

import com.tournapro.entity.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Player Repository - Data access layer for Player entity
 * Add this file to: backend/src/main/java/com/tournapro/repository/PlayerRepository.java
 */
@Repository
public interface PlayerRepository extends JpaRepository<Player, Long> {

    /**
     * Find all players belonging to a specific team
     */
    List<Player> findByTeamId(Long teamId);

    /**
     * Find all players in a tournament (through team relationship)
     */
    @Query("SELECT p FROM Player p WHERE p.team.tournament.id = :tournamentId")
    List<Player> findByTournamentId(@Param("tournamentId") Long tournamentId);

    /**
     * Find players by team and jersey number
     */
    Player findByTeamIdAndJerseyNumber(Long teamId, Integer jerseyNumber);

    /**
     * Find top scorers in a tournament
     */
    @Query("SELECT p FROM Player p WHERE p.team.tournament.id = :tournamentId ORDER BY p.goals DESC")
    List<Player> findTopScorersByTournament(@Param("tournamentId") Long tournamentId);

    /**
     * Find players by position
     */
    List<Player> findByTeamIdAndPosition(Long teamId, String position);

    /**
     * Count players in a team
     */
    long countByTeamId(Long teamId);
}
