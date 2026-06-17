<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Auth extends CI_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->database();
        $this->load->model('User_model');
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
        $tanggal_lahir = trim($input['tanggal_lahir'] ?? $input['tanggalLahir'] ?? '');

        if ($email !== '' && $password !== '' && $nama !== '') {
            if ($this->User_model->checkEmailExists($email)) {
                return $this->apiResponse(['status' => 'gagal', 'pesan' => 'Email sudah terdaftar!'], 409);
            }

            $data_user = [
                'email'         => $email,
                'nama'          => $nama,
                'password'      => password_hash($password, PASSWORD_BCRYPT),
                'tanggal_lahir' => ($tanggal_lahir !== '') ? $tanggal_lahir : null
            ];

            $this->User_model->insert($data_user);
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
            $user = $this->User_model->getByEmail($email);
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

    // ---------------------------------------------------------
    // 3. ENDPOINT POST: Update Profil
    // ---------------------------------------------------------
    public function updateProfile() {
        $is_multipart = strpos($_SERVER['CONTENT_TYPE'] ?? '', 'multipart/form-data') !== false;

        if ($is_multipart) {
            $id_user = $this->input->post('id_user');
            $email = trim($this->input->post('email') ?? '');
            $nama = trim($this->input->post('nama') ?? '');
            $password = trim($this->input->post('password') ?? '');
            $tanggal_lahir = trim($this->input->post('tanggal_lahir') ?? '');
        } else {
            $input = $this->getJsonInput();
            $id_user = $input['id_user'] ?? '';
            $email = trim($input['email'] ?? '');
            $nama = trim($input['nama'] ?? '');
            $password = trim($input['password'] ?? '');
            $tanggal_lahir = trim($input['tanggal_lahir'] ?? '');
        }

        if ($id_user !== '' && $email !== '' && $nama !== '') {
            // Cek apakah email sudah dipakai user lain
            if ($this->User_model->checkEmailOtherUser($email, $id_user)) {
                return $this->apiResponse(['status' => 'gagal', 'pesan' => 'Email sudah digunakan oleh akun lain!'], 409);
            }

            $update_data = [
                'nama' => $nama,
                'email' => $email,
                'tanggal_lahir' => ($tanggal_lahir !== '') ? $tanggal_lahir : null
            ];

            if ($password !== '') {
                $update_data['password'] = password_hash($password, PASSWORD_BCRYPT);
            }

            // Handle upload foto profil
            if (isset($_FILES['foto']) && $_FILES['foto']['error'] === UPLOAD_ERR_OK) {
                $upload_path = FCPATH . 'uploads/profil/';
                if (!is_dir($upload_path)) {
                    mkdir($upload_path, 0777, true);
                }

                $config['upload_path']   = $upload_path;
                $config['allowed_types'] = 'gif|jpg|png|jpeg';
                $config['max_size']      = 5120; // 5MB
                $config['file_name']     = 'profil_' . $id_user . '_' . time();

                $this->load->library('upload', $config);

                if ($this->upload->do_upload('foto')) {
                    $upload_data = $this->upload->data();
                    $update_data['foto'] = $upload_data['file_name'];
                    
                    // Ambil foto lama untuk dihapus
                    $old_user = $this->User_model->getById($id_user);
                    if ($old_user && !empty($old_user['foto']) && file_exists($upload_path . $old_user['foto'])) {
                        @unlink($upload_path . $old_user['foto']);
                    }
                } else {
                    return $this->apiResponse(['status' => 'gagal', 'pesan' => $this->upload->display_errors('', '')], 400);
                }
            }

            $this->User_model->update($id_user, $update_data);

            // Ambil data terbaru untuk di-return
            $user = $this->User_model->getById($id_user);
            if ($user) {
                unset($user['password']);
                return $this->apiResponse([
                    'status' => 'sukses',
                    'pesan' => 'Profil berhasil diperbarui!',
                    'user' => $user
                ]);
            }
        }

        return $this->apiResponse(['status' => 'gagal', 'pesan' => 'ID, Nama, dan Email wajib diisi!'], 400);
    }
}

