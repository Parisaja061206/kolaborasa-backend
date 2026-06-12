<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Aspirasi extends CI_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->database();
        
        // SANGAT PENTING: Konfigurasi CORS agar React diizinkan mengambil data dari server ini
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
            die();
        }
    }

    // ---------------------------------------------------------
    // 1. ENDPOINT GET: Mengambil semua data aspirasi warga
    // ---------------------------------------------------------
    public function index() {
        // Melakukan JOIN dengan tabel user agar nama pengirim ikut terbawa
        $this->db->select('ide.*, user.nama');
        $this->db->from('ide');
        $this->db->join('user', 'ide.id_user = user.id_user', 'left');
        $this->db->order_by('created_at', 'DESC'); // Mengurutkan dari yang paling baru
        
        $query = $this->db->get();
        $data_ide = $query->result_array();

        $respons = [
            'status' => 'sukses',
            'pesan'  => 'Data aspirasi berhasil diambil',
            'data'   => $data_ide
        ];

        $this->output
            ->set_content_type('application/json')
            ->set_output(json_encode($respons));
    }

    // ---------------------------------------------------------
    // 2. ENDPOINT POST: Menyimpan aspirasi baru dari warga
    // ---------------------------------------------------------
    public function tambah() {
        // React mengirim data dalam format JSON, bukan Form-Data biasa. 
        // Jadi kita menangkapnya menggunakan php://input
        $input_json = file_get_contents('php://input');
        $input = json_decode($input_json, true);

        if (!empty($input['id_user']) && !empty($input['judul_ide']) && !empty($input['deskripsi'])) {
            $data_simpan = [
                'id_user'   => $input['id_user'],
                'judul_ide' => $input['judul_ide'],
                'deskripsi' => $input['deskripsi'],
                // Pastikan nama kolom di atas persis dengan yang ada di tabel 'ide' kalian
            ];
            
            $this->db->insert('ide', $data_simpan);

            $respons = [
                'status' => 'sukses',
                'pesan'  => 'Aspirasi inovasi berhasil dikirimkan!'
            ];
        } else {
            $respons = [
                'status' => 'gagal',
                'pesan'  => 'Data id_user, judul_ide, dan deskripsi tidak boleh kosong!'
            ];
        }

        $this->output
            ->set_content_type('application/json')
            ->set_output(json_encode($respons));
    }
}