<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class User_model extends CI_Model {

    private $table = 'user';

    public function insert($data) {
        return $this->db->insert($this->table, $data);
    }

    public function getByEmail($email) {
        return $this->db->get_where($this->table, ['email' => $email])->row_array();
    }

    public function getById($id_user) {
        return $this->db->get_where($this->table, ['id_user' => $id_user])->row_array();
    }

    public function checkEmailExists($email) {
        return $this->db->get_where($this->table, ['email' => $email])->num_rows() > 0;
    }

    public function checkEmailOtherUser($email, $id_user) {
        return $this->db->get_where($this->table, ['email' => $email, 'id_user !=' => $id_user])->num_rows() > 0;
    }

    public function update($id_user, $data) {
        $this->db->where('id_user', $id_user);
        return $this->db->update($this->table, $data);
    }
}
