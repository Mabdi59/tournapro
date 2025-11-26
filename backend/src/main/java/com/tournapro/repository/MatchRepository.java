package com.tournapro.repository;

import com.tournapro.entity.Division;
import com.tournapro.entity.Match;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {
    List<Match> findByDivision(Division division);
    List<Match> findByDivisionOrderByRoundAscBracketPositionAsc(Division division);
}
