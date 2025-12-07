package com.tournapro.repository;

import com.tournapro.entity.Team;
import com.tournapro.entity.Tournament;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TeamRepository extends JpaRepository<Team, Long> {

    List<Team> findByTournamentOrderByNameAsc(Tournament tournament);
}
