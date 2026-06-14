<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class ApiIde extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();

        $this->load->model('Ide_model');
        $this->load->database();
    }

    public function index()
    {
        $lokasi = $this->input->get('lokasi');

        $data = $this->Ide_model->getAll($lokasi);

        echo json_encode([
            'status' => true,
            'data' => $data
        ]);
    }

    public function detail($id)
    {
        $data = $this->Ide_model->getById($id);

        echo json_encode([
            'status' => true,
            'data' => $data
        ]);
    }

    public function tambah()
    {
        $gambar = '';

        if(isset($_FILES['gambar']))
        {
            $config['upload_path'] = './uploads/ide/';
            $config['allowed_types'] = 'jpg|jpeg|png';
            $config['encrypt_name'] = TRUE;

            $this->load->library('upload',$config);

            if($this->upload->do_upload('gambar'))
            {
                $gambar = $this->upload
                    ->data('file_name');
            }
        }

        $data = [
            'id_user' => $this->input->post('id_user'),
            'judul' => $this->input->post('judul'),
            'isi' => $this->input->post('isi'),
            'lokasi' => $this->input->post('lokasi'),
            'gambar' => $gambar
        ];

        $this->Ide_model->insert($data);

        echo json_encode([
            'status'=>true,
            'message'=>'Ide berhasil ditambahkan'
        ]);
    }

    public function like($id)
    {
        $this->Ide_model->addLike($id);

        echo json_encode([
            'status'=>true,
            'message'=>'Like berhasil'
        ]);
    }

    public function hapus($id)
    {
        $this->Ide_model->delete($id);

        echo json_encode([
            'status'=>true
        ]);
    }
    public function statistik()
    {
        $data = $this->Ide_model->getStatistik();

        echo json_encode([
            'status' => true,
            'data' => $data
        ]);
    }

    public function lokasi()
    {
        $data = $this->db
            ->distinct()
            ->select('lokasi')
            ->where('lokasi IS NOT NULL')
            ->get('ide')
            ->result();

        echo json_encode([
            'status' => true,
            'data' => $data
        ]);
    }
}