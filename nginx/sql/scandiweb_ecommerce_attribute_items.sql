-- MySQL dump 10.13  Distrib 8.0.36, for Linux (x86_64)
--
-- Host: localhost    Database: scandiweb_ecommerce
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `attribute_items`
--

DROP TABLE IF EXISTS `attribute_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attribute_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `attribute_id` int DEFAULT NULL,
  `display_value` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `value` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `attribute_id` (`attribute_id`),
  CONSTRAINT `attribute_items_ibfk_1` FOREIGN KEY (`attribute_id`) REFERENCES `product_attributes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attribute_items`
--

LOCK TABLES `attribute_items` WRITE;
/*!40000 ALTER TABLE `attribute_items` DISABLE KEYS */;
INSERT INTO `attribute_items` VALUES (1,1,'40','40'),(2,1,'41','41'),(3,1,'42','42'),(4,1,'43','43'),(5,2,'Small','S'),(6,2,'Medium','M'),(7,2,'Large','L'),(8,2,'Extra Large','XL'),(16,5,'Green','#44FF03'),(17,3,'Green','#44FF03'),(18,11,'Green','#44FF03'),(19,5,'Cyan','#03FFF7'),(20,3,'Cyan','#03FFF7'),(21,11,'Cyan','#03FFF7'),(22,5,'Blue','#030BFF'),(23,3,'Blue','#030BFF'),(24,11,'Blue','#030BFF'),(25,5,'Black','#000000'),(26,3,'Black','#000000'),(27,11,'Black','#000000'),(28,5,'White','#FFFFFF'),(29,3,'White','#FFFFFF'),(30,11,'White','#FFFFFF'),(31,6,'512G','512G'),(32,4,'512G','512G'),(33,10,'512G','512G'),(34,6,'1T','1T'),(35,4,'1T','1T'),(36,10,'1T','1T'),(38,7,'256GB','256GB'),(39,7,'512GB','512GB'),(40,8,'Yes','Yes'),(41,9,'Yes','Yes'),(42,8,'No','No'),(43,9,'No','No');
/*!40000 ALTER TABLE `attribute_items` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-23  1:05:27
