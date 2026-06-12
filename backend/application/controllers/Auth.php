<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Auth extends CI_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->database();
        
        // Konfigurasi CORS agar React lokal/publik bisa mengakses
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
            die();
        }
    }

    // ---------------------------------------------------------
    // 1. ENDPOINT POST: Registrasi Akun Warga Baru
    // ---------------------------------------------------------
    public function register() {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!empty($input['email']) && !empty($input['password']) && !empty($input['nama'])) {
            
            // Cek apakah email sudah terdaftar sebelumnya
            $cek_email = $this->db->get_where('user', ['email' => $input['email']])->num_rows();
            if ($cek_email > 0) {
                $respons = ['status' => 'gagal', 'pesan' => 'Email sudah terdaftar!'];
            } else {
                // Siapkan data dengan password yang diamankan (hashing)
                $data_user = [
                    'email'    => $input['email'],
                    'nama'     => $input['nama'],
                    'password' => password_hash($input['password'], PASSWORD_BCRYPT)
                ];

                $this->db->insert('user', $data_user);
                $respons = ['status' => 'sukses', 'pesan' => 'Registrasi berhasil, silakan login!'];
            }
        } else {
            $respons = ['status' => 'gagal', 'pesan' => 'Data tidak boleh kosong!'];
        }

        $this->output->set_content_type('application/json')->set_output(json_encode($respons));
    }

    // ---------------------------------------------------------
    // 2. ENDPOINT POST: Login Warga
    // ---------------------------------------------------------
    public function login() {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!empty($input['email']) && !empty($input['password'])) {
            // Cari user berdasarkan email
            $user = $this->db->get_where('user', ['email' => $input['email']])->row_array();

            if ($user) {
                // Verifikasi apakah password cocok dengan hash di database
                if (password_verify($input['password'], $user['password'])) {
                    
                    // Jangan kirim password kembali ke frontend demi keamanan
                    unset($user['password']);

                    $respons = [
                        'status' => 'sukses',
                        'pesan'  => 'Login berhasil!',
                        'user'   => $user // Data ini akan disimpan React di localStorage
                    ];
                } else {
                    $respons = ['status' => 'gagal', 'pesan' => 'Password salah!'];
                }
            } else {
                $respons = ['status' => 'gagal', 'pesan' => 'Email tidak ditemukan!'];
            }
        } else {
            $respons = ['status' => 'gagal', 'pesan' => 'Email dan Password wajib diisi!'];
        }

        $this->output->set_content_type('application/json')->set_output(json_encode($respons));
    }
}