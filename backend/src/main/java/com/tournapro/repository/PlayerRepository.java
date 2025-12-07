package com.tournapro.repository;

import com.tournapro.entity.Player;
import com.tournapro.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PlayerRepository extends JpaRepository<Player, Long> {

    List<Player> findByTeamOrderByNameAsc(Team team);
}

