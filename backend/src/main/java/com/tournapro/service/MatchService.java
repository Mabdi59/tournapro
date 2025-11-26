package com.tournapro.service;

import com.tournapro.dto.MatchResultRequest;
import com.tournapro.entity.Division;
import com.tournapro.entity.Match;
import com.tournapro.entity.Team;
import com.tournapro.repository.DivisionRepository;
import com.tournapro.repository.MatchRepository;
import com.tournapro.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MatchService {

    private final MatchRepository matchRepository;
    private final DivisionRepository divisionRepository;
    private final TeamRepository teamRepository;

    public List<Match> getMatchesByDivision(Long divisionId) {
        Division division = divisionRepository.findById(divisionId)
                .orElseThrow(() -> new RuntimeException("Division not found"));
        return matchRepository.findByDivisionOrderByRoundAscBracketPositionAsc(division);
    }

    public Match getMatchById(Long id) {
        return matchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Match not found"));
    }

    @Transactional
    public Match updateMatchResult(Long id, MatchResultRequest request) {
        Match match = getMatchById(id);
        
        if (match.getTeam1() == null || match.getTeam2() == null) {
            throw new RuntimeException("Cannot update result for incomplete match");
        }

        match.setTeam1Score(request.getTeam1Score());
        match.setTeam2Score(request.getTeam2Score());
        match.setStatus(Match.MatchStatus.COMPLETED);
        match.setCompletedTime(LocalDateTime.now());

        // Determine winner
        Team winner = null;
        if (request.getTeam1Score() > request.getTeam2Score()) {
            winner = match.getTeam1();
            updateTeamStats(match.getTeam1(), true, false);
            updateTeamStats(match.getTeam2(), false, false);
        } else if (request.getTeam2Score() > request.getTeam1Score()) {
            winner = match.getTeam2();
            updateTeamStats(match.getTeam2(), true, false);
            updateTeamStats(match.getTeam1(), false, false);
        } else {
            // Draw
            updateTeamStats(match.getTeam1(), false, true);
            updateTeamStats(match.getTeam2(), false, true);
        }
        match.setWinner(winner);

        matchRepository.save(match);

        // For single elimination, advance winner to next round
        if (match.getDivision().getTournament().getFormat() == 
            com.tournapro.entity.Tournament.TournamentFormat.SINGLE_ELIMINATION && winner != null) {
            advanceWinnerToNextRound(match, winner);
        }

        return match;
    }

    private void updateTeamStats(Team team, boolean won, boolean draw) {
        if (won) {
            team.setWins(team.getWins() + 1);
            team.setPoints(team.getPoints() + 3);
        } else if (draw) {
            team.setDraws(team.getDraws() + 1);
            team.setPoints(team.getPoints() + 1);
        } else {
            team.setLosses(team.getLosses() + 1);
        }
        teamRepository.save(team);
    }

    private void advanceWinnerToNextRound(Match currentMatch, Team winner) {
        int nextRound = currentMatch.getRound() + 1;
        int nextBracketPosition = currentMatch.getBracketPosition() / 2;

        List<Match> nextRoundMatches = matchRepository.findByDivision(currentMatch.getDivision())
                .stream()
                .filter(m -> m.getRound() == nextRound && m.getBracketPosition() == nextBracketPosition)
                .toList();

        if (!nextRoundMatches.isEmpty()) {
            Match nextMatch = nextRoundMatches.get(0);
            if (nextMatch.getTeam1() == null) {
                nextMatch.setTeam1(winner);
            } else if (nextMatch.getTeam2() == null) {
                nextMatch.setTeam2(winner);
            }
            matchRepository.save(nextMatch);
        }
    }
}
