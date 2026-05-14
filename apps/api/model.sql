CREATE TABLE users {
  id VARCHAR(36) NOT NULL,
  document_type ENUM('cc', 'ti', 'passport') NOT NULL,
  document_number VARCHAR(20) NOT NULL,
  email VARCHAR(254) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin','doctor','patient') NOT NULL,
  refreshTokenHash VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,

  PRIMARY KEY id,
  INDEX (email),
  UNIQUE KEY unique_document (document_type, document_number)
}

CREATE UNIQUE INDEX users_email_unique
ON users(email)
WHERE deleted_at IS NULL;

CREATE TABLE doctors {
  user_id VARCHAR(36) NOT NULL,
  specialty VARCHAR(50) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (user_id),
  CONSTRAINT user_id_doctor_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
}

CREATE TABLE patients {
  user_id VARCHAR(36) NOT NULL,
  birth_date DATE NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (user_id),
  CONSTRAINT user_id_patient_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
}

CREATE TABLE prescriptions {
  id VARCHAR(36) NOT NULL,
  doctor_id VARCHAR(36) NOT NULL,
  patient_id VARCHAR(36) NOT NULL,
  code VARCHAR(255) NOT NULL,
  status ENUM('pending','consumed') NOT NULL,
  notes VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  consumed_at TIMESTAMP NULL,
  deleted_at TIMESTAMP NULL,

  PRIMARY KEY (id),
  INDEX (doctor_id),
  INDEX (patient_id),
  INDEX (status, created_at),
  CONSTRAINT doctor_id_prescription_fk FOREIGN KEY (doctor_id) REFERENCES doctors(user_id) ON DELETE CASCADE,
  CONSTRAINT patient_id_prescription_fk FOREIGN KEY (patient_id) REFERENCES patients(user_id) ON DELETE CASCADE,
}

CREATE UNIQUE INDEX prescriptions_code_unique
ON prescriptions(code)
WHERE deleted_at IS NULL;

CREATE TABLE prescription_items {
  id VARCHAR(36) NOT NULL,
  prescription_id VARCHAR(36) NOT NULL,
  name VARCHAR(100) NOT NULL,
  dosage VARCHAR(100) NULL,
  quantity INT NULL,
  instructions VARCHAR(500) NULL,

  PRIMARY KEY (id)
  CONSTRAINT prescription_id_items_fk FOREIGN KEY (prescription_id) REFERENCES prescriptions(prescription_id) ON DELETE CASCADE,
}
