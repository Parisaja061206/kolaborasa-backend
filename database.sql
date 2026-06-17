-- Create Database
CREATE DATABASE IF NOT EXISTS db_kolaborasa;
USE db_kolaborasa;

-- Table structure for table `user`
CREATE TABLE IF NOT EXISTS `user` (
  `id_user` int(11) NOT NULL AUTO_INCREMENT,
  `nama` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `tanggal_lahir` date DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `lokasi` varchar(100) DEFAULT 'Bandung, Indonesia',
  PRIMARY KEY (`id_user`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Table structure for table `ide`
CREATE TABLE IF NOT EXISTS `ide` (
  `id_ide` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) NOT NULL,
  `judul` varchar(255) NOT NULL,
  `isi` text NOT NULL,
  `lokasi` varchar(100) NOT NULL,
  `status` varchar(20) DEFAULT 'publish',
  `gambar` varchar(255) DEFAULT NULL,
  `jumlah_like` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_ide`),
  KEY `id_user` (`id_user`),
  CONSTRAINT `ide_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Table structure for table `komentar`
CREATE TABLE IF NOT EXISTS `komentar` (
  `id_komentar` int(11) NOT NULL AUTO_INCREMENT,
  `id_ide` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `isi_komentar` text NOT NULL,
  `rating` int(11) DEFAULT 0,
  `jumlah_like` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_komentar`),
  KEY `id_ide` (`id_ide`),
  KEY `id_user` (`id_user`),
  CONSTRAINT `komentar_ibfk_1` FOREIGN KEY (`id_ide`) REFERENCES `ide` (`id_ide`) ON DELETE CASCADE,
  CONSTRAINT `komentar_ibfk_2` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

