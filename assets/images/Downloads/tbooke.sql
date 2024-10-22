-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 17, 2024 at 07:03 PM
-- Server version: 10.4.18-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tbooke`
--

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('admin@qwerkz.com|127.0.0.1', 'i:1;', 1712918792),
('admin@qwerkz.com|127.0.0.1:timer', 'i:1712918792;', 1712918792);

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `post_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`id`, `post_id`, `user_id`, `content`, `created_at`, `updated_at`) VALUES
(10, 7, 2, 'Kenya, located in East Africa, has a diverse history marked by its cultural richness and struggle for independence from British colonial rule in 1963. Known for its stunning landscapes and economic growth in sectors like agriculture, tourism, and technology, Kenya embodies a blend of tradition and progress, making it a fascinating destination to explore.', '2024-04-14 07:29:53', '2024-04-14 07:29:53'),
(11, 1, 1, 'Mathematics is the elegant language of logic and problem-solving, offering a path to understanding the beauty of numbers and their applications. Let\'s embark on a journey of discovery and exploration together! 🌟🔢 #Mathematics #Logic #ProblemSolving #Discovery', '2024-04-14 07:43:57', '2024-04-14 07:43:57'),
(12, 5, 1, 'I like history so much. Can\'t wait to delve into this!', '2024-04-14 08:41:52', '2024-04-14 08:41:52'),
(13, 5, 3, 'Hey Mercy, welcome to the history class. I look forward to interacting with you in this space.', '2024-04-14 09:45:57', '2024-04-14 09:45:57'),
(14, 7, 3, 'Kenya, situated in East Africa, boasts a vibrant history shaped by its cultural diversity, colonial legacy, and struggle for independence. With multiple ethnic groups contributing unique traditions and customs, the country gained independence from British rule in 1963, marking a pivotal moment in its development. Known for its stunning natural landscapes, from iconic savannahs to wildlife reserves like the Maasai Mara, Kenya has also experienced significant economic growth, particularly in sectors such as agriculture, tourism, and technology, highlighting its journey towards progress and innovation.', '2024-04-14 18:28:55', '2024-04-14 18:28:55'),
(24, 1, 3, 'Mathematics is more than just numbers and formulas—it\'s a gateway to logical reasoning and creative problem-solving. Join me in exploring the endless possibilities that numbers and logic can unveil! 🌌🧩 #Mathematics #Logic #ProblemSolving #Exploration', '2024-04-14 21:18:04', '2024-04-14 21:18:04'),
(25, 7, 1, 'I found your post useful. Kudos mate!', '2024-04-14 21:23:05', '2024-04-14 21:23:05'),
(28, 7, 1, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.', '2024-04-17 06:36:40', '2024-04-17 06:36:40');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `institution_details`
--

CREATE TABLE `institution_details` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `about` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `website` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2024_03_24_195307_add_role_to_users_table', 2),
(5, '2024_03_24_203553_create_teacher_details_table', 3),
(6, '2024_03_24_210021_create_teacher_details_table', 4),
(7, '2024_03_24_224405_create_roles_table', 5),
(8, '2024_03_24_225346_create_roles_table', 6),
(9, '2024_03_24_231807_create_roles_table', 7),
(10, '2024_03_24_232959_create_model_has_roles_table', 8),
(11, '2024_03_25_101907_create_institution_details_table', 9),
(12, '2024_04_04_135855_add_profile_picture_path_to_users_table', 10),
(13, '2024_04_04_203300_create_posts_table', 11),
(14, '2024_04_11_201602_create_comments_table', 12);

-- --------------------------------------------------------

--
-- Table structure for table `model_has_roles`
--

CREATE TABLE `model_has_roles` (
  `role_id` bigint(20) UNSIGNED NOT NULL,
  `model_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `model_has_roles`
--

INSERT INTO `model_has_roles` (`role_id`, `model_type`, `model_id`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\User', 1, NULL, NULL),
(2, 'App\\Models\\User', 1, NULL, NULL),
(3, 'App\\Models\\User', 1, NULL, NULL),
(1, 'App\\Models\\User', 2, NULL, NULL),
(2, 'App\\Models\\User', 2, NULL, NULL),
(3, 'App\\Models\\User', 2, NULL, NULL),
(1, 'App\\Models\\User', 3, NULL, NULL),
(3, 'App\\Models\\User', 3, NULL, NULL),
(1, 'App\\Models\\User', 4, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`id`, `user_id`, `content`, `created_at`, `updated_at`) VALUES
(1, 1, 'Mathematics isn\'t just numbers and equations; it\'s a language of logic and problem-solving. Whether you\'re a math enthusiast or looking to improve your skills, let\'s unravel the beauty of numbers together! 🧠💡 #Mathematics #Logic #ProblemSolving #LearningJourney', '2024-04-05 19:48:45', '2024-04-05 19:48:45'),
(2, 1, 'Business studies includes principles like management, finance, marketing, and economics, honing critical skills for business roles 🛠️. It fosters an entrepreneurial mindset 🚀, encouraging innovation and creativity 🎨.', '2024-04-05 19:50:01', '2024-04-05 19:50:01'),
(3, 2, 'Dive into the world of numbers and equations with mathematics! From unraveling the mysteries of prime numbers to exploring the elegance of geometric shapes, mathematics is the language of logic and problem-solving. Let\'s embark on a journey of discovery and unlock the beauty of patterns and formulas that shape our understanding of the universe! 🌌➕➗ #Mathematics #Logic #ProblemSolving #Discoveries', '2024-04-05 19:51:59', '2024-04-05 19:51:59'),
(4, 1, 'Embrace the chaos and sprinkle some laughter into your day! Whether it\'s dancing in your pajamas or chasing after rainbows, let\'s celebrate the little moments that make life sparkle. Remember, the best adventures often begin with a spontaneous giggle and a dash of whimsy! ✨ #FunTimes #LaughterIsTheBestMedicine #SpontaneousAdventures #EmbraceTheChaos', '2024-04-06 18:30:51', '2024-04-06 18:30:51'),
(5, 2, 'Hey everyone! Just wrapped up a fascinating lecture on ancient civilizations 🏛️. Learning about the mysteries of the pyramids and the myths of ancient gods has me hooked! 🌟 Can\'t wait to dive deeper into history and unravel more secrets from the past. Who else is excited about our upcoming field trip to the museum? 🎨 #HistoryBuff #AncientCivilizations #LearningIsFun #ExcitedForFieldTrip', '2024-04-10 13:18:17', '2024-04-10 13:18:17'),
(6, 2, 'Discover the magic of marketing ✨ by delving into consumer insights and crafting compelling campaigns. Unleash your creativity 🎨 and strategic prowess to create lasting brand impressions! Join the journey to mastering marketing 🚀!', '2024-04-10 18:58:28', '2024-04-10 18:58:28'),
(7, 4, 'Kenya, a country located in the eastern region of the African continent, has a rich and diverse history. Let’s explore some key points.', '2024-04-12 04:25:57', '2024-04-12 04:25:57');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guard_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES
(1, 'teacher', 'web', '2024-03-24 20:25:36', '2024-03-24 20:25:36'),
(2, 'student', 'web', '2024-03-24 20:25:36', '2024-03-24 20:25:36'),
(3, 'institution', 'web', '2024-03-25 10:11:18', '2024-03-25 10:11:18');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('TxIFxTSmLGAFzLyIwGpXAtqiIXEnZNpQ2VMZlXUJ', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', 'YTo1OntzOjY6Il90b2tlbiI7czo0MDoiU2RRclB5M1FkOHdESGU3VXhMS3FLVVJiRk84V3dtYndTak5aWFBYMyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjY6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9mZWVkIjt9czozOiJ1cmwiO2E6MDp7fXM6NTA6ImxvZ2luX3dlYl81OWJhMzZhZGRjMmIyZjk0MDE1ODBmMDE0YzdmNThlYTRlMzA5ODlkIjtpOjE7fQ==', 1713370872);

-- --------------------------------------------------------

--
-- Table structure for table `student_details`
--

CREATE TABLE `student_details` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `about` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_subjects` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `favorite_topics` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `socials` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `profile_pic` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `student_details`
--

INSERT INTO `student_details` (`id`, `about`, `user_subjects`, `favorite_topics`, `socials`, `profile_pic`, `created_at`, `updated_at`) VALUES
(2, 'As a dedicated learner, I am committed to expanding my knowledge and achieving academic excellence through hard work, curiosity, and a passion for learning.', 'Mathematics,Business', 'Calculus,Marketing,Algebra', '{\"facebook\":\"https:\\/\\/facebook.com\\/Mercy\",\"twitter\":\"https:\\/\\/twitter.com\\/Mercy\"}', NULL, '2024-04-04 10:36:29', '2024-04-10 18:34:38');

-- --------------------------------------------------------

--
-- Table structure for table `teacher_details`
--

CREATE TABLE `teacher_details` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `about` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_subjects` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `favorite_topics` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `socials` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`socials`)),
  `profile_picture` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `teacher_details`
--

INSERT INTO `teacher_details` (`id`, `about`, `user_subjects`, `favorite_topics`, `socials`, `profile_picture`, `created_at`, `updated_at`) VALUES
(1, 'I am passionate about empowering students to reach their full potential through engaging and interactive lessons. I also like playing soccer.', 'Mathematics,Business,Kiswahili,Geography', 'Algebra,Calculus,Insurance,Marketing', '{\"facebook\":\"https:\\/\\/facebook.com\\/EricKokib\",\"twitter\":\"https:\\/\\/twitter.com\\/EricKokib\"}', NULL, '2024-03-25 13:19:22', '2024-04-17 07:12:50'),
(3, 'Dedicated teacher passionate about empowering students to reach their full potential through engaging and interactive lessons.', 'Business,Kiswahili', NULL, '{\"facebook\":null,\"twitter\":null}', NULL, '2024-04-11 07:05:45', '2024-04-11 09:43:59'),
(4, 'I am a dedicated History teacher. Lorem ipsum  Lorem ipsum  Lorem ipsum', 'Business,Kiswahili', 'Calculus,Marketing', '{\"facebook\":null,\"twitter\":null}', NULL, '2024-04-12 04:19:48', '2024-04-12 04:22:39');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `profile_type` enum('teacher','student','institution','other') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'student',
  `profile_picture` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`, `profile_type`, `profile_picture`) VALUES
(1, 'Erick Cheruiyot', 'kibete20@gmail.com', NULL, '$2y$12$O2./TPcLw00HT9VZPgzdFO9gFE5bxBCFCFm8g82UDLZbEIK6G92pi', NULL, '2024-03-25 13:19:22', '2024-04-10 18:20:47', 'teacher', 'profile-images/profile_1712353943.jpeg'),
(2, 'Mercy Rungu', 'mercy@gmail.com', NULL, '$2y$12$KVcehLPgNmgmWV/8WzSOuOr6mDTszl8zbZUVPEPFC9Bs6kHr1u.xO', NULL, '2024-04-04 10:36:29', '2024-04-10 18:34:38', 'student', 'profile-images/profile_1712784878.png'),
(3, 'Faith Nguyo', 'faith@gmail.com', NULL, '$2y$12$jz4Y92BHmkVJMoIveRrXzOHDdInyAyqV9MjVPmtR2ktb2tYIsKra6', NULL, '2024-04-11 07:05:45', '2024-04-11 09:39:01', 'teacher', 'profile-images/profile_1712839141.png'),
(4, 'Jared Otieno', 'jaredotieno@gmail.com', NULL, '$2y$12$NHTnKnxF5qbamCd6DHZsKeGhvtjQwIUWRgWl07j.tyFtA41X7IlaO', NULL, '2024-04-12 04:19:48', '2024-04-12 04:21:20', 'teacher', 'profile-images/profile_1712906480.jpeg');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `comments_post_id_foreign` (`post_id`),
  ADD KEY `comments_user_id_foreign` (`user_id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `institution_details`
--
ALTER TABLE `institution_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id` (`id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `model_has_roles`
--
ALTER TABLE `model_has_roles`
  ADD UNIQUE KEY `model_has_roles_model_id_model_type_role_id_unique` (`model_id`,`model_type`,`role_id`),
  ADD KEY `model_has_roles_role_id_foreign` (`role_id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `posts_user_id_foreign` (`user_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `student_details`
--
ALTER TABLE `student_details`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `students_id_unique` (`id`);

--
-- Indexes for table `teacher_details`
--
ALTER TABLE `teacher_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id` (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `institution_details`
--
ALTER TABLE `institution_details`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `student_details`
--
ALTER TABLE `student_details`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `teacher_details`
--
ALTER TABLE `teacher_details`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_post_id_foreign` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comments_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `model_has_roles`
--
ALTER TABLE `model_has_roles`
  ADD CONSTRAINT `model_has_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
