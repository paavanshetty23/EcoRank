DROP TABLE IF EXISTS rankings;
DROP TABLE IF EXISTS evaluations;
DROP TABLE IF EXISTS candidates;

CREATE TABLE candidates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    years_experience INT NOT NULL,
    skills JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_name (name),
    INDEX idx_experience (years_experience)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE evaluations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id INT NOT NULL,
    crisis_management_score FLOAT NOT NULL,
    sustainability_score FLOAT NOT NULL,
    team_motivation_score FLOAT NOT NULL,
    total_score FLOAT DEFAULT 0,
    evaluated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE,
    INDEX idx_candidate_id (candidate_id),
    INDEX idx_total_score (total_score DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE rankings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id INT NOT NULL UNIQUE,
    rank_position INT NOT NULL,
    total_score FLOAT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE,
    INDEX idx_total_score (total_score DESC),
    INDEX idx_rank_position (rank_position)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELIMITER $$

CREATE TRIGGER before_evaluation_insert
BEFORE INSERT ON evaluations
FOR EACH ROW
BEGIN
    SET NEW.total_score = (NEW.crisis_management_score + NEW.sustainability_score + NEW.team_motivation_score) / 3;
END$$

CREATE TRIGGER before_evaluation_update
BEFORE UPDATE ON evaluations
FOR EACH ROW
BEGIN
    SET NEW.total_score = (NEW.crisis_management_score + NEW.sustainability_score + NEW.team_motivation_score) / 3;
END$$

CREATE TRIGGER after_evaluation_insert
AFTER INSERT ON evaluations
FOR EACH ROW
BEGIN
    INSERT INTO rankings (candidate_id, total_score, rank_position)
    VALUES (NEW.candidate_id, NEW.total_score, 0)
    ON DUPLICATE KEY UPDATE 
        total_score = NEW.total_score,
        updated_at = CURRENT_TIMESTAMP;
    
    SET @rank := 0;
    UPDATE rankings
    SET rank_position = (@rank := @rank + 1)
    ORDER BY total_score DESC, candidate_id ASC;
END$$

CREATE TRIGGER after_evaluation_update
AFTER UPDATE ON evaluations
FOR EACH ROW
BEGIN
    UPDATE rankings
    SET total_score = NEW.total_score,
        updated_at = CURRENT_TIMESTAMP
    WHERE candidate_id = NEW.candidate_id;
    
    SET @rank := 0;
    UPDATE rankings
    SET rank_position = (@rank := @rank + 1)
    ORDER BY total_score DESC, candidate_id ASC;
END$$

DELIMITER ;
