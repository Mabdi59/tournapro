package com.tournapro.repository;

import com.tournapro.entity.Division;
import com.tournapro.entity.Team;
import com.tournapro.entity.Tournament;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {
    List<Team> findByTournament(Tournament tournament);
    List<Team> findByDivision(Division division);
}
