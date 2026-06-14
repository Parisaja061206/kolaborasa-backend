<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Ide_model extends CI_Model
{
    private $table = 'ide';

    public function getAll($lokasi = null)
    {
        if(!empty($lokasi))
        {
            $this->db->where('lokasi', $lokasi);
        }

        return $this->db
            ->order_by('created_at','DESC')
            ->get('ide')
            ->result();
    }

    public function getById($id)
    {
        return $this->db
            ->where('id_ide',$id)
            ->get($this->table)
            ->row();
    }

    public function insert($data)
    {
        return $this->db->insert($this->table,$data);
    }

    public function update($id,$data)
    {
        return $this->db
            ->where('id_ide',$id)
            ->update($this->table,$data);
    }

    public function delete($id)
    {
        return $this->db
            ->where('id_ide',$id)
            ->delete($this->table);
    }

    public function addLike($id)
    {
        $this->db->set(
            'jumlah_like',
            'jumlah_like + 1',
            FALSE
        );

        return $this->db
            ->where('id_ide',$id)
            ->update($this->table);
    }

    public function getStatistik()
    {
        $totalIde = $this->db
            ->count_all_results('ide');

        $draftIde = $this->db
            ->where('status','draft')
            ->count_all_results('ide');

        return [
            'total_ide' => $totalIde,
            'draft_ide' => $draftIde
        ];
    }
}