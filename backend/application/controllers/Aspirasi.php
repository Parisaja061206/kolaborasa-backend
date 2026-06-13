<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Aspirasi extends CI_Controller {

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
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
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
    // 1. ENDPOINT GET: Mengambil semua data aspirasi warga
    // ---------------------------------------------------------
    public function index() {
        $this->db->select('ide.*, user.nama');
        $this->db->from('ide');
        $this->db->join('user', 'ide.id_user = user.id_user', 'left');
        $this->db->order_by('ide.created_at', 'DESC');

        $query = $this->db->get();
        $data_ide = $query->result_array();

        return $this->apiResponse([
            'status' => 'sukses',
            'pesan'  => 'Data aspirasi berhasil diambil',
            'data'   => $data_ide
        ]);
    }

    // ---------------------------------------------------------
    // 2. ENDPOINT POST: Menyimpan aspirasi baru dari warga
    // ---------------------------------------------------------
    public function tambah() {
        $input = $this->getJsonInput();
        $id_user = $input['id_user'] ?? $input['user_id'] ?? null;
        $judul_ide = trim($input['judul_ide'] ?? $input['judul'] ?? '');
        $deskripsi = trim($input['deskripsi'] ?? $input['description'] ?? '');
        
        // Menangkap status_progress dari frontend. Default 'Menunggu' jika kosong.
        $status_progress = trim($input['status_progress'] ?? 'Menunggu');

        if (!empty($id_user) && $judul_ide !== '' && $deskripsi !== '') {
            $data_simpan = [
                'id_user'         => $id_user,
                'judul_ide'       => $judul_ide,
                'deskripsi'       => $deskripsi,
                'status_progress' => $status_progress // Menyimpan Draft / Menunggu ke database
            ];

            $this->db->insert('ide', $data_simpan);
            $insert_id = $this->db->insert_id();

            return $this->apiResponse([
                'status' => 'sukses',
                'pesan'  => 'Ide berhasil disimpan!',
                'id_ide' => $insert_id
            ], 201);
        }

        return $this->apiResponse([
            'status' => 'gagal',
            'pesan'  => 'Data id_user, judul_ide, dan deskripsi wajib diisi!'
        ], 400);
    }

    // ---------------------------------------------------------
    // 3. ENDPOINT GET: Mengambil statistik jumlah ide pengguna
    // ---------------------------------------------------------
    public function user_stats($id_user = null) {
        if (!$id_user) {
            return $this->apiResponse([
                'status' => 'error',
                'pesan'  => 'ID User tidak diberikan'
            ], 400);
        }

        // Menghitung Total Semua Ide milik user (Publik + Draft)
        $this->db->where('id_user', $id_user);
        $total_ide = $this->db->count_all_results('ide');

        // Menghitung Jumlah ide yang berstatus Draft
        $this->db->where('id_user', $id_user);
        $this->db->where('status_progress', 'Draft'); 
        $draft_ide = $this->db->count_all_results('ide');

        return $this->apiResponse([
            'status' => 'sukses',
            'data'   => [
                'total_ide' => $total_ide,
                'draft_ide' => $draft_ide
            ]
        ]);
    }
}
<?php