<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Auth extends CI_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->database();
        $this->sendCorsHeaders();

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            exit;
        }
    }

    protected function sendCorsHeaders() {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    }

    protected function getJsonInput() {
        $input = json_decode(file_get_contents('php://input'), true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            return [];
        }
        return is_array($input) ? $input : [];
    }

    protected function apiResponse(array $data, int $statusCode = 200) {
        return $this->output
            ->set_status_header($statusCode)
            ->set_content_type('application/json', 'utf-8')
            ->set_output(json_encode($data));
    }

    // ---------------------------------------------------------
    // 1. ENDPOINT POST: Registrasi Akun Warga Baru
    // ---------------------------------------------------------
    public function register() {
        $input = $this->getJsonInput();
        $email = trim($input['email'] ?? '');
        $password = trim($input['password'] ?? '');
        $nama = trim($input['nama'] ?? $input['name'] ?? '');

        if ($email !== '' && $password !== '' && $nama !== '') {
            $cek_email = $this->db->get_where('user', ['email' => $email])->num_rows();
            if ($cek_email > 0) {
                return $this->apiResponse(['status' => 'gagal', 'pesan' => 'Email sudah terdaftar!'], 409);
            }

            $data_user = [
                'email'    => $email,
                'nama'     => $nama,
                'password' => password_hash($password, PASSWORD_BCRYPT)
            ];

            $this->db->insert('user', $data_user);
            return $this->apiResponse(['status' => 'sukses', 'pesan' => 'Registrasi berhasil! Silakan login.']);
        }

        return $this->apiResponse(['status' => 'gagal', 'pesan' => 'Email, nama, dan password wajib diisi!'], 400);
    }

    // ---------------------------------------------------------
    // 2. ENDPOINT POST: Login Warga
    // ---------------------------------------------------------
    public function login() {
        $input = $this->getJsonInput();
        $email = trim($input['email'] ?? '');
        $password = trim($input['password'] ?? '');

        if ($email !== '' && $password !== '') {
            $user = $this->db->get_where('user', ['email' => $email])->row_array();
            if ($user && password_verify($password, $user['password'])) {
                unset($user['password']);
                return $this->apiResponse([
                    'status' => 'sukses',
                    'pesan'  => 'Login berhasil!',
                    'user'   => $user
                ]);
            }

            return $this->apiResponse(['status' => 'gagal', 'pesan' => 'Email atau password salah!'], 401);
        }

        return $this->apiResponse(['status' => 'gagal', 'pesan' => 'Email dan Password wajib diisi!'], 400);
    }
}
