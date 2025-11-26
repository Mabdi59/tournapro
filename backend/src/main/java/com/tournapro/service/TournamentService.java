package com.tournapro.service;

import com.tournapro.dto.TournamentRequest;
import com.tournapro.entity.Division;
import com.tournapro.entity.Match;
import com.tournapro.entity.Team;
import com.tournapro.entity.Tournament;
import com.tournapro.entity.User;
import com.tournapro.repository.DivisionRepository;
import com.tournapro.repository.MatchRepository;
import com.tournapro.repository.TeamRepository;
import com.tournapro.repository.TournamentRepository;
import com.tournapro.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TournamentService {

    private final TournamentRepository tournamentRepository;
    private final UserRepository userRepository;
    private final DivisionRepository divisionRepository;
    private final TeamRepository teamRepository;
    private final MatchRepository matchRepository;

    @Transactional
    public Tournament createTournament(TournamentRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User organizer = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Tournament tournament = new Tournament();
        tournament.setName(request.getName());
        tournament.setDescription(request.getDescription());
        tournament.setStartDate(request.getStartDate());
        tournament.setEndDate(request.getEndDate());
        tournament.setLocation(request.getLocation());
        tournament.setFormat(request.getFormat());
        tournament.setOrganizer(organizer);

        return tournamentRepository.save(tournament);
    }

    public List<Tournament> getAllTournaments() {
        return tournamentRepository.findAll();
    }

    public Tournament getTournamentById(Long id) {
        return tournamentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tournament not found"));
    }

    public List<Tournament> getMyTournaments() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User organizer = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return tournamentRepository.findByOrganizer(organizer);
    }

    @Transactional
    public Tournament updateTournament(Long id, TournamentRequest request) {
        Tournament tournament = getTournamentById(id);
        
        tournament.setName(request.getName());
        tournament.setDescription(request.getDescription());
        tournament.setStartDate(request.getStartDate());
        tournament.setEndDate(request.getEndDate());
        tournament.setLocation(request.getLocation());
        tournament.setFormat(request.getFormat());

        return tournamentRepository.save(tournament);
    }

    @Transactional
    public void deleteTournament(Long id) {
        tournamentRepository.deleteById(id);
    }

    @Transactional
    public void generateSchedule(Long tournamentId, Long divisionId) {
        Tournament tournament = getTournamentById(tournamentId);
        Division division = divisionRepository.findById(divisionId)
                .orElseThrow(() -> new RuntimeException("Division not found"));

        List<Team> teams = teamRepository.findByDivision(division);
        
        if (teams.size() < 2) {
            throw new RuntimeException("Need at least 2 teams to generate schedule");
        }

        // Clear existing matches for this division
        List<Match> existingMatches = matchRepository.findByDivision(division);
        matchRepository.deleteAll(existingMatches);

        if (tournament.getFormat() == Tournament.TournamentFormat.ROUND_ROBIN) {
            generateRoundRobinSchedule(division, teams);
        } else if (tournament.getFormat() == Tournament.TournamentFormat.SINGLE_ELIMINATION) {
            generateSingleEliminationSchedule(division, teams);
        }
    }

    private void generateRoundRobinSchedule(Division division, List<Team> teams) {
        List<Match> matches = new ArrayList<>();
        int round = 1;
        int matchesPerRound = teams.size() / 2;
        if (matchesPerRound == 0) matchesPerRound = 1;
        int matchesInCurrentRound = 0;

        for (int i = 0; i < teams.size(); i++) {
            for (int j = i + 1; j < teams.size(); j++) {
                Match match = new Match();
                match.setDivision(division);
                match.setTeam1(teams.get(i));
                match.setTeam2(teams.get(j));
                match.setRound(round);
                match.setStatus(Match.MatchStatus.SCHEDULED);
                matches.add(match);
                
                matchesInCurrentRound++;
                if (matchesInCurrentRound >= matchesPerRound) {
                    round++;
                    matchesInCurrentRound = 0;
                }
            }
        }

        matchRepository.saveAll(matches);
    }

    private void generateSingleEliminationSchedule(Division division, List<Team> teams) {
        List<Team> shuffledTeams = new ArrayList<>(teams);
        Collections.shuffle(shuffledTeams);

        // Calculate the number of rounds needed
        int numTeams = shuffledTeams.size();
        int nextPowerOfTwo = 1;
        while (nextPowerOfTwo < numTeams) {
            nextPowerOfTwo *= 2;
        }

        List<Match> matches = new ArrayList<>();
        int bracketPosition = 0;

        // Create first round matches
        for (int i = 0; i < shuffledTeams.size(); i += 2) {
            if (i + 1 < shuffledTeams.size()) {
                Match match = new Match();
                match.setDivision(division);
                match.setTeam1(shuffledTeams.get(i));
                match.setTeam2(shuffledTeams.get(i + 1));
                match.setRound(1);
                match.setBracketPosition(bracketPosition++);
                match.setStatus(Match.MatchStatus.SCHEDULED);
                matches.add(match);
            }
        }

        // Create placeholder matches for subsequent rounds
        int totalRounds = (int) (Math.log(nextPowerOfTwo) / Math.log(2));
        int matchesInRound = matches.size();
        
        for (int round = 2; round <= totalRounds; round++) {
            matchesInRound = matchesInRound / 2;
            for (int i = 0; i < matchesInRound; i++) {
                Match match = new Match();
                match.setDivision(division);
                match.setRound(round);
                match.setBracketPosition(bracketPosition++);
                match.setStatus(Match.MatchStatus.SCHEDULED);
                matches.add(match);
            }
        }

        matchRepository.saveAll(matches);
    }
}
