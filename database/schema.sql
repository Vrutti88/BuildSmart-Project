CREATE TABLE users(
id INT PRIMARY KEY AUTO_INCREMENT,
name VARCHAR(100),
email VARCHAR(100),
password VARCHAR(255),
role VARCHAR(50)
);

CREATE TABLE projects(
id INT PRIMARY KEY AUTO_INCREMENT,
project_name VARCHAR(255),
location VARCHAR(255),
budget DECIMAL(12,2)
);

CREATE TABLE tasks(
id INT PRIMARY KEY AUTO_INCREMENT,
task_name VARCHAR(255),
assigned_to VARCHAR(255),
status VARCHAR(50)
);

CREATE TABLE approvals(
id INT PRIMARY KEY AUTO_INCREMENT,
task_name VARCHAR(255),
status VARCHAR(50),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_logs(
id INT PRIMARY KEY AUTO_INCREMENT,
action VARCHAR(255),
user_name VARCHAR(100),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reports(
id INT PRIMARY KEY AUTO_INCREMENT,
report_name VARCHAR(255),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


INSERT INTO users
(name,email,password,role)
VALUES
(
'Admin',
'admin@buildsmart.com',
'$2b$10$XWptvv.fbMBCyrRQvT/RwuykQrQefHWRgAdE76vMaqTA1Lp0czb3O',
'ADMIN'
);

INSERT INTO users
(name,email,password,role)
VALUES
(
'Manager',
'manager@buildsmart.com',
'$2b$10$XWptvv.fbMBCyrRQvT/RwuykQrQefHWRgAdE76vMaqTA1Lp0czb3O',
'MANAGER'
);

INSERT INTO users
(name,email,password,role)
VALUES
(
'Engineer',
'engineer@buildsmart.com',
'$2b$10$XWptvv.fbMBCyrRQvT/RwuykQrQefHWRgAdE76vMaqTA1Lp0czb3O',
'ENGINEER'
);