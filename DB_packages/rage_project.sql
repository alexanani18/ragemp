-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 08, 2023 at 03:54 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `rage_project`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `id` int(11) NOT NULL,
  `username` varchar(35) NOT NULL,
  `password` varchar(256) NOT NULL,
  `email` varchar(50) NOT NULL DEFAULT '',
  `money` int(20) NOT NULL DEFAULT 5000,
  `moneyBank` int(20) NOT NULL DEFAULT 5000,
  `premiumPoints` int(11) NOT NULL DEFAULT 0,
  `admin` int(11) NOT NULL DEFAULT 0,
  `helper` int(11) NOT NULL DEFAULT 0,
  `level` int(11) NOT NULL DEFAULT 1,
  `experience` int(11) NOT NULL DEFAULT 0,
  `needExperience` int(11) NOT NULL DEFAULT 300,
  `hours` int(11) NOT NULL DEFAULT 0,
  `modelPlayer` varchar(100) NOT NULL DEFAULT 'a_m_y_beachvesp_01',
  `playerPremium` int(11) NOT NULL DEFAULT 0,
  `playerWarns` int(11) NOT NULL DEFAULT 0,
  `drivingLicense` int(11) NOT NULL DEFAULT 0,
  `boatLicense` int(11) NOT NULL DEFAULT 0,
  `job` int(11) NOT NULL DEFAULT -1,
  `house` int(11) NOT NULL DEFAULT -1,
  `business` int(11) NOT NULL DEFAULT 999,
  `mute` int(11) NOT NULL DEFAULT 0,
  `spawnChange` int(11) NOT NULL DEFAULT 0,
  `playerGroup` int(11) NOT NULL DEFAULT -1,
  `playerGroupRank` int(11) NOT NULL DEFAULT 0,
  `playerGroupFP` int(11) NOT NULL DEFAULT 0,
  `playerGroupWarns` int(11) NOT NULL DEFAULT 0,
  `playerGroupDays` int(11) NOT NULL DEFAULT 0,
  `wanted` int(11) NOT NULL DEFAULT 0,
  `wantedTime` int(11) NOT NULL DEFAULT 0,
  `wantedCrimes` varchar(100) NOT NULL DEFAULT '',
  `wantedCrimeTime` varchar(100) NOT NULL DEFAULT '',
  `wantedCaller` varchar(100) NOT NULL DEFAULT '',
  `water` int(11) NOT NULL DEFAULT 100,
  `food` int(11) NOT NULL DEFAULT 100,
  `sex` varchar(50) NOT NULL DEFAULT 'Male',
  `skin` varchar(50) NOT NULL DEFAULT 'a_m_y_beachvesp_01',
  `vehicleSlots` int(11) NOT NULL DEFAULT 2,
  `totalVehs` int(11) NOT NULL DEFAULT 0,
  `playerLastOnline` varchar(100) NOT NULL DEFAULT 'no last login',
  `status` int(11) NOT NULL DEFAULT 0,
  `phoneNumber` varchar(10) NOT NULL DEFAULT '',
  `lastSpawnX` float NOT NULL DEFAULT -1041.15,
  `lastSpawnY` float NOT NULL DEFAULT -2744.27,
  `lastSpawnZ` float NOT NULL DEFAULT 21.359,
  `lastSpawnA` float NOT NULL DEFAULT 327.559,
  `playerCrimes` int(11) NOT NULL DEFAULT 0,
  `playerArrests` int(11) NOT NULL DEFAULT 0,
  `helperChat` int(11) NOT NULL DEFAULT 1,
  `groupChat` int(11) NOT NULL DEFAULT 1,
  `hudStatus` int(11) NOT NULL DEFAULT 1
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`id`, `username`, `password`, `email`, `money`, `moneyBank`, `premiumPoints`, `admin`, `helper`, `level`, `experience`, `needExperience`, `hours`, `modelPlayer`, `playerPremium`, `playerWarns`, `drivingLicense`, `boatLicense`, `job`, `house`, `business`, `mute`, `spawnChange`, `playerGroup`, `playerGroupRank`, `playerGroupFP`, `playerGroupWarns`, `playerGroupDays`, `wanted`, `wantedTime`, `wantedCrimes`, `wantedCrimeTime`, `wantedCaller`, `water`, `food`, `sex`, `skin`, `vehicleSlots`, `totalVehs`, `playerLastOnline`, `status`, `phoneNumber`, `lastSpawnX`, `lastSpawnY`, `lastSpawnZ`, `lastSpawnA`, `playerCrimes`, `playerArrests`, `helperChat`, `groupChat`, `hudStatus`) VALUES
(7, 'alex', '$2a$10$L/9KpBUYgnOKn8OhTYsocuGX52B8nxkMiK6sRNWO9s8F1CvLxiC12', 'alex@gmail.com', 2147482136, 5000, 0, 1337, 0, 1, 0, 300, 0, 'u_m_m_aldinapoli', 0, 0, 999, 500, -1, -1, 999, 0, 0, -1, 0, 0, 0, 0, 0, 0, '', '', '', 100, 100, 'Male', 'a_m_y_beachvesp_01', 2, 0, '8 sep 2021 [16 : 34]', 1, '', -1041.15, -2744.27, 21.359, 327.559, 0, 0, 1, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `player_inventory`
--

CREATE TABLE `player_inventory` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `type` int(11) NOT NULL DEFAULT 501,
  `indexItem` varchar(50) NOT NULL DEFAULT '-1',
  `invColor` int(11) NOT NULL DEFAULT 0,
  `name` varchar(50) NOT NULL DEFAULT 'burger',
  `quantity` int(40) NOT NULL DEFAULT 0,
  `invUsed` tinyint(1) NOT NULL DEFAULT 0,
  `gender` int(11) NOT NULL DEFAULT -1
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `player_transactions`
--

CREATE TABLE `player_transactions` (
  `transactionID` int(11) NOT NULL,
  `playerSQLID` int(11) NOT NULL,
  `playerAmount` int(11) NOT NULL DEFAULT 0,
  `transactionType` int(11) NOT NULL DEFAULT 0,
  `transactionDate` varchar(100) NOT NULL DEFAULT 'no date'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `server_business`
--

CREATE TABLE `server_business` (
  `businessID` int(11) NOT NULL,
  `businessOwner` varchar(50) NOT NULL DEFAULT 'AdmBot',
  `businessPrice` int(11) NOT NULL DEFAULT 0,
  `businessFee` int(11) NOT NULL DEFAULT 0,
  `businessBalance` int(11) NOT NULL DEFAULT 0,
  `businessDescription` varchar(200) NOT NULL DEFAULT 'no description',
  `businessIcon` int(11) NOT NULL DEFAULT 11,
  `businessType` int(11) NOT NULL DEFAULT 0,
  `businessInterior` int(11) NOT NULL DEFAULT 0,
  `businessVirtual` int(11) NOT NULL DEFAULT 0,
  `exitX` float NOT NULL DEFAULT 1.1,
  `exitY` float NOT NULL DEFAULT 1.1,
  `exitZ` float NOT NULL DEFAULT 1.1,
  `entX` float NOT NULL DEFAULT 1.1,
  `entY` float NOT NULL DEFAULT 1.1,
  `entZ` float NOT NULL DEFAULT 1.1
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `server_business`
--

INSERT INTO `server_business` (`businessID`, `businessOwner`, `businessPrice`, `businessFee`, `businessBalance`, `businessDescription`, `businessIcon`, `businessType`, `businessInterior`, `businessVirtual`, `exitX`, `exitY`, `exitZ`, `entX`, `entY`, `entZ`) VALUES
(1, 'AdmBot', 0, 0, 0, '24/7', 11, 2, 0, 0, 1731.08, 6411.02, 35.001, 1729.44, 6415.33, 35.037),
(2, 'AdmBot', 0, 0, 0, 'Clothing Store', 366, 4, 0, 0, 127.136, -210.875, 54.5341, 125.568, -223.522, 54.5578),
(4, 'AdmBot', 0, 0, 0, 'Tunning', 446, 0, 0, 0, -354.697, -128.191, 39.4306, -336.109, -135.591, 38.6496),
(5, 'AdmBot', 0, 0, 0, 'Gun Shop', 11, 3, 0, 0, 17.1584, -1115.62, 29.7911, 21.1319, -1106.51, 29.797),
(6, 'AdmBot', 0, 0, 0, 'Gas Station', 11, 1, 0, 0, 167.053, -1553.4, 29.2617, 174.963, -1562.23, 29.2642);

-- --------------------------------------------------------

--
-- Table structure for table `server_characters`
--

CREATE TABLE `server_characters` (
  `ID` int(11) NOT NULL,
  `owner` int(11) NOT NULL,
  `gender` int(11) NOT NULL,
  `mother` int(11) NOT NULL,
  `father` int(11) NOT NULL,
  `skin` float NOT NULL,
  `hair` int(11) NOT NULL,
  `hairColor` int(11) NOT NULL,
  `eyeColor` int(11) NOT NULL,
  `eyeSize` float NOT NULL,
  `eyeBrow` float NOT NULL,
  `noseWidth` float NOT NULL,
  `noseHeight` float NOT NULL,
  `beard` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `server_characters`
--

INSERT INTO `server_characters` (`ID`, `owner`, `gender`, `mother`, `father`, `skin`, `hair`, `hairColor`, `eyeColor`, `eyeSize`, `eyeBrow`, `noseWidth`, `noseHeight`, `beard`) VALUES
(5, 7, 0, 21, 4, 0.5, 0, 0, 0, 0, 0, 0, 0, 255);

-- --------------------------------------------------------

--
-- Table structure for table `server_dealership_vehicles`
--

CREATE TABLE `server_dealership_vehicles` (
  `dealerID` int(11) NOT NULL,
  `dealerModel` varchar(100) NOT NULL DEFAULT 'Baller',
  `dealerPrice` int(11) NOT NULL DEFAULT 1000000,
  `dealerStock` int(11) NOT NULL DEFAULT 20,
  `dealerSpeed` int(11) NOT NULL DEFAULT 200
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `server_dealership_vehicles`
--

INSERT INTO `server_dealership_vehicles` (`dealerID`, `dealerModel`, `dealerPrice`, `dealerStock`, `dealerSpeed`) VALUES
(1, 'Shotaro', 1000000, 981, 200),
(2, 'Baller', 1000000, 17, 200),
(3, 'T20', 5000000, 7, 200);

-- --------------------------------------------------------

--
-- Table structure for table `server_jobs`
--

CREATE TABLE `server_jobs` (
  `jobID` int(11) NOT NULL,
  `jobName` varchar(50) NOT NULL DEFAULT 'sema',
  `jobPosX` float NOT NULL DEFAULT 1.1,
  `jobPosY` float NOT NULL DEFAULT 1.1,
  `jobPosZ` float NOT NULL DEFAULT 1.1,
  `jobWorkX` float NOT NULL,
  `jobWorkY` float NOT NULL,
  `jobWorkZ` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `server_jobs`
--

INSERT INTO `server_jobs` (`jobID`, `jobName`, `jobPosX`, `jobPosY`, `jobPosZ`, `jobWorkX`, `jobWorkY`, `jobWorkZ`) VALUES
(1, 'Fisherman', -1845.02, -1195.58, 19.184, 0, 0, 0),
(2, 'Trucker', 764.835, -1358.77, 27.878, 719.912, -1369.56, 26.204),
(3, 'Farmer', 2243.35, 5154.08, 57.887, 2251.65, 5155.36, 57.887),
(4, 'Drugs dealer', 2213.96, 4778, 40.164, 2235.31, 4795.71, 39.956);

-- --------------------------------------------------------

--
-- Table structure for table `server_player_vehicles`
--

CREATE TABLE `server_player_vehicles` (
  `vehicleID` int(11) NOT NULL,
  `vehicleModel` varchar(100) NOT NULL DEFAULT 'T20',
  `vehicleOwner` int(11) NOT NULL DEFAULT 0,
  `vehicleOdometer` float NOT NULL DEFAULT 0,
  `vehicleNumber` varchar(100) NOT NULL DEFAULT 'B-02-NEW',
  `vehicleregDate` varchar(100) NOT NULL DEFAULT 'no date',
  `vehiclePosX` float NOT NULL DEFAULT -1035.16,
  `vehiclePosY` float NOT NULL DEFAULT -2729.86,
  `vehiclePosZ` float NOT NULL DEFAULT 19.631,
  `vehiclePosA` float NOT NULL DEFAULT 240.395,
  `vehicleStatus` varchar(10) NOT NULL DEFAULT 'true',
  `colorOne` int(10) NOT NULL DEFAULT 255,
  `colorTwo` int(10) NOT NULL DEFAULT 255,
  `colorThree` int(10) NOT NULL DEFAULT 255
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `server_player_vehicles`
--

INSERT INTO `server_player_vehicles` (`vehicleID`, `vehicleModel`, `vehicleOwner`, `vehicleOdometer`, `vehicleNumber`, `vehicleregDate`, `vehiclePosX`, `vehiclePosY`, `vehiclePosZ`, `vehiclePosA`, `vehicleStatus`, `colorOne`, `colorTwo`, `colorThree`) VALUES
(1, 'Urus', 7, 0, 'B-02-NEW', 'no date', -59.1075, -1116.85, 26.0094, 2.4308, 'true', 255, 255, 255);

-- --------------------------------------------------------

--
-- Table structure for table `server_rent_vehicles`
--

CREATE TABLE `server_rent_vehicles` (
  `rentID` int(11) NOT NULL,
  `rentModel` varchar(100) NOT NULL DEFAULT 'Infernus',
  `rentPrice` int(11) NOT NULL DEFAULT 1000000,
  `rentStock` int(11) NOT NULL DEFAULT 10
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `server_rent_vehicles`
--

INSERT INTO `server_rent_vehicles` (`rentID`, `rentModel`, `rentPrice`, `rentStock`) VALUES
(1, 'Infernus', 500000000, 4),
(2, 'Bullet', 5000000, 4),
(3, 'NRG - 500', 2040000, 2);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `player_inventory`
--
ALTER TABLE `player_inventory`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `player_transactions`
--
ALTER TABLE `player_transactions`
  ADD PRIMARY KEY (`transactionID`);

--
-- Indexes for table `server_business`
--
ALTER TABLE `server_business`
  ADD PRIMARY KEY (`businessID`);

--
-- Indexes for table `server_characters`
--
ALTER TABLE `server_characters`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `server_dealership_vehicles`
--
ALTER TABLE `server_dealership_vehicles`
  ADD PRIMARY KEY (`dealerID`);

--
-- Indexes for table `server_jobs`
--
ALTER TABLE `server_jobs`
  ADD PRIMARY KEY (`jobID`);

--
-- Indexes for table `server_player_vehicles`
--
ALTER TABLE `server_player_vehicles`
  ADD PRIMARY KEY (`vehicleID`);

--
-- Indexes for table `server_rent_vehicles`
--
ALTER TABLE `server_rent_vehicles`
  ADD PRIMARY KEY (`rentID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `player_inventory`
--
ALTER TABLE `player_inventory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `player_transactions`
--
ALTER TABLE `player_transactions`
  MODIFY `transactionID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `server_business`
--
ALTER TABLE `server_business`
  MODIFY `businessID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `server_characters`
--
ALTER TABLE `server_characters`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `server_dealership_vehicles`
--
ALTER TABLE `server_dealership_vehicles`
  MODIFY `dealerID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `server_jobs`
--
ALTER TABLE `server_jobs`
  MODIFY `jobID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `server_player_vehicles`
--
ALTER TABLE `server_player_vehicles`
  MODIFY `vehicleID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `server_rent_vehicles`
--
ALTER TABLE `server_rent_vehicles`
  MODIFY `rentID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
