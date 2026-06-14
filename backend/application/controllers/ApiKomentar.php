<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class ApiKomentar extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();

        $this->load->model('Komentar_model');
    }

    public function ide($id_ide)
    {
        $data = $this->Komentar_model
            ->getByIde($id_ide);

        echo json_encode([
            'status'=>true,
            'data'=>$data
        ]);
    }

    public function tambah()
    {
        $data = [
            'id_ide' => $this->input->post('id_ide'),
            'id_user' => $this->input->post('id_user'),
            'isi_komentar' => $this->input->post('isi_komentar'),
            'rating' => $this->input->post('rating')
        ];

        $this->Komentar_model->insert($data);

        echo json_encode([
            'status'=>true,
            'message'=>'Komentar berhasil ditambahkan'
        ]);
    }

    public function like($id)
    {
        $this->Komentar_model->addLike($id);

        echo json_encode([
            'status'=>true
        ]);
    }
}