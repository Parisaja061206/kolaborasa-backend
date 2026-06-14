<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Komentar_model extends CI_Model
{
    private $table = 'komentar';

    public function getByIde($id_ide)
    {
        return $this->db
            ->select('komentar.*, user.nama')
            ->from('komentar')
            ->join('user','user.id_user=komentar.id_user')
            ->where('id_ide',$id_ide)
            ->get()
            ->result();
    }

    public function insert($data)
    {
        return $this->db->insert(
            $this->table,
            $data
        );
    }

    public function addLike($id)
    {
        $this->db->set(
            'jumlah_like',
            'jumlah_like + 1',
            FALSE
        );

        return $this->db
            ->where('id_komentar',$id)
            ->update($this->table);
    }
}