-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema poll
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `poll` ;

-- -----------------------------------------------------
-- Schema poll
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `poll` DEFAULT CHARACTER SET utf8 ;
USE `poll` ;

-- -----------------------------------------------------
-- Table `poll`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `poll`.`user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(64) NOT NULL,
  `password` VARCHAR(128) NOT NULL COMMENT 'SHA512 - 128 characters',
  `firstname` VARCHAR(45) NULL,
  `lastname` VARCHAR(45) NULL,
  `username` VARCHAR(64) NULL,
  `email_activation_key` VARCHAR(64) NULL,
  `active` TINYINT(1) NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `iduser_UNIQUE` (`id` ASC),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `poll`.`form`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `poll`.`form` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  `description` TEXT NULL,
  `order` ENUM('random', 'position') NULL,
  `form_uuid` VARCHAR(36) NOT NULL,
  `created_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `active` TINYINT(1) NULL DEFAULT 0,
  `password_restriction` TINYINT(1) NULL DEFAULT 0,
  `password` VARCHAR(128) NULL DEFAULT NULL,
  `deleted` TINYINT(1) NULL DEFAULT 0,
  `cookie_restriction` TINYINT(1) NULL DEFAULT 0,
  `ip_address_restriction` TINYINT(1) NULL DEFAULT 0,
  `ip_address` VARCHAR(15) NULL,
  `completed` TINYINT(1) NULL DEFAULT 0,
  `complete_date` TIMESTAMP NULL DEFAULT NULL,
  `completion_notify` TINYINT(1) NULL DEFAULT 0,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  INDEX `fk_form_user_idx` (`user_id` ASC),
  UNIQUE INDEX `form_uuid_UNIQUE` (`form_uuid` ASC),
  CONSTRAINT `fk_form_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `poll`.`user` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `poll`.`form_question`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `poll`.`form_question` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `description` TEXT NULL DEFAULT NULL,
  `image` VARCHAR(64) NULL,
  `type` VARCHAR(45) NOT NULL,
  `position` INT NULL,
  `form_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  INDEX `fk_form_question_form1_idx` (`form_id` ASC),
  UNIQUE INDEX `name_form_id_UNIQUE` (`form_id` ASC, `name` ASC),
  CONSTRAINT `fk_form_question_form1`
    FOREIGN KEY (`form_id`)
    REFERENCES `poll`.`form` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `poll`.`form_question`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `poll`.`form_question` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `description` TEXT NULL DEFAULT NULL,
  `image` VARCHAR(64) NULL,
  `type` VARCHAR(45) NOT NULL,
  `position` INT NULL,
  `form_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  INDEX `fk_form_question_form1_idx` (`form_id` ASC),
  UNIQUE INDEX `name_form_id_UNIQUE` (`form_id` ASC, `name` ASC),
  CONSTRAINT `fk_form_question_form1`
    FOREIGN KEY (`form_id`)
    REFERENCES `poll`.`form` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `poll`.`respondent`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `poll`.`respondent` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `guest_uuid` VARCHAR(36) NULL,
  `ip_address` VARCHAR(15) NULL,
  `start_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `end_date` TIMESTAMP NULL DEFAULT NULL,
  `os_platform` VARCHAR(45) NULL,
  `user_agent` VARCHAR(45) NULL,
  `completed` TINYINT(1) NULL DEFAULT 0,
  `form_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  INDEX `fk_respondent_form1_idx` (`form_id` ASC),
  UNIQUE INDEX `guest_uuid_UNIQUE` (`guest_uuid` ASC),
  CONSTRAINT `fk_respondent_form1`
    FOREIGN KEY (`form_id`)
    REFERENCES `poll`.`form` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `poll`.`form_question_answer`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `poll`.`form_question_answer` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `form_question_id` INT NOT NULL,
  `name` VARCHAR(45) NULL,
  INDEX `fk_table2_form_question1_idx` (`form_question_id` ASC),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_table2_form_question1`
    FOREIGN KEY (`form_question_id`)
    REFERENCES `poll`.`form_question` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `poll`.`respondent_vote`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `poll`.`respondent_vote` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `custom_answer` VARCHAR(64) NULL,
  `form_question_answer_id` INT NULL DEFAULT NULL,
  `form_question_id` INT NOT NULL,
  `form_id` INT NOT NULL,
  `respondent_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_form_vote_form_question1_idx` (`form_question_id` ASC),
  INDEX `fk_form_vote_form1_idx` (`form_id` ASC),
  INDEX `fk_form_vote_respondent1_idx` (`respondent_id` ASC),
  INDEX `fk_respondent_vote_form_question_answer1_idx` (`form_question_answer_id` ASC),
  UNIQUE INDEX `UNIQUE_respondent_form_question` (`respondent_id` ASC, `form_id` ASC, `form_question_id` ASC),
  CONSTRAINT `fk_form_vote_form_question1`
    FOREIGN KEY (`form_question_id`)
    REFERENCES `poll`.`form_question` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_form_vote_form1`
    FOREIGN KEY (`form_id`)
    REFERENCES `poll`.`form` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_form_vote_guest1`
    FOREIGN KEY (`respondent_id`)
    REFERENCES `poll`.`respondent` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_respondent_vote_form_question_answer1`
    FOREIGN KEY (`form_question_answer_id`)
    REFERENCES `poll`.`form_question_answer` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `poll`.`authentication`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `poll`.`authentication` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `token_uuid` VARCHAR(36) NULL,
  `type` ENUM('salt', 'token') NULL DEFAULT 'salt',
  `salt` VARCHAR(64) NULL,
  `is_valid` TINYINT(1) NULL DEFAULT 1,
  `created` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  INDEX `fk_authentication_user1_idx` (`user_id` ASC),
  UNIQUE INDEX `token_uuid_UNIQUE` (`token_uuid` ASC),
  CONSTRAINT `fk_authentication_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `poll`.`user` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
