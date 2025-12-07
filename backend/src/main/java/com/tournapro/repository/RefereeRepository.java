package com.tournapro.repository;

import com.tournapro.entity.Referee;
import com.tournapro.entity.Tournament;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RefereeRepository extends JpaRepository<Referee, Long> {

    List<Referee> findByTournamentOrderByNameAsc(Tournament tournament);
}

