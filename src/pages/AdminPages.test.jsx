import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ManageUsers } from './manageUsers/ManageUsers';
import { ManageSoal } from './manageSoal/ManageSoal';

describe('AdminPages TDD Tests', () => {
  describe('ManageUsers Component', () => {
    it('renders initial users and correctly filters by search input', () => {
      render(<ManageUsers />);
      expect(screen.getByText('Siti Aminah')).toBeInTheDocument();
      expect(screen.getByText('Budi Santoso')).toBeInTheDocument();
      
      const searchInput = screen.getByPlaceholderText(/Cari email atau nama/i);
      fireEvent.change(searchInput, { target: { value: 'Budi' } });
      
      expect(screen.queryByText('Siti Aminah')).not.toBeInTheDocument();
      expect(screen.getByText('Budi Santoso')).toBeInTheDocument();
    });

    it('correctly filters users by status dropdown', () => {
      render(<ManageUsers />);
      // Initially Ahmad Fauzi is suspended, others are active
      expect(screen.getByText('Ahmad Fauzi')).toBeInTheDocument();
      expect(screen.getByText('Siti Aminah')).toBeInTheDocument();

      // Find the dropdown (currently showing "Semua Status")
      const dropdown = screen.getByText('Semua Status');
      fireEvent.click(dropdown);

      // Select "Aktif"
      const activeOption = screen.getByText('Aktif', { selector: 'div.cursor-pointer' });
      fireEvent.click(activeOption);

      // Ahmad Fauzi should disappear
      expect(screen.queryByText('Ahmad Fauzi')).not.toBeInTheDocument();
      expect(screen.getByText('Siti Aminah')).toBeInTheDocument();
    });

    it('toggles user status from Aktif to Suspend', () => {
      render(<ManageUsers />);
      const suspendButtons = screen.getAllByTitle('Suspend');
      
      // Click the first suspend button
      fireEvent.click(suspendButtons[0]);
      
      // Should now render two 'Aktifkan' buttons (1 originally + 1 newly suspended)
      expect(screen.getAllByTitle('Aktifkan').length).toBe(2);
    });

    it('opens confirmation modal and successfully deletes a user', () => {
      render(<ManageUsers />);
      
      // Assuming 'Siti Aminah' is initially present
      expect(screen.getByText('Siti Aminah')).toBeInTheDocument();
      
      const deleteButtons = screen.getAllByTitle('Hapus');
      fireEvent.click(deleteButtons[0]); // Click first user's delete button
      
      // Modal should appear
      expect(screen.getByText(/Apakah kamu yakin ingin menghapus akun siswa ini/i)).toBeInTheDocument();
      
      const confirmBtn = screen.getByText(/Hapus Permanen/i);
      fireEvent.click(confirmBtn);
      
      // User should be deleted
      expect(screen.queryByText('Siti Aminah')).not.toBeInTheDocument();
      
      // Modal should be closed
      expect(screen.queryByText(/Apakah kamu yakin ingin menghapus akun siswa ini/i)).not.toBeInTheDocument();
    });
  });

  describe('ManageSoal Component', () => {
    it('opens add modal, submits form, and adds new Soal to list', () => {
      render(<ManageSoal />);
      
      // Initially 3 delete buttons meaning 3 items
      expect(screen.getAllByTitle('Hapus').length).toBe(3);
      
      const addBtn = screen.getByText(/Tambah Soal/i);
      fireEvent.click(addBtn);
      
      // Modal should appear
      expect(screen.getByText(/Tambah Soal Baru/i)).toBeInTheDocument();
      
      const saveBtn = screen.getByText(/Simpan Soal/i);
      fireEvent.click(saveBtn);
      
      // Modal should close
      expect(screen.queryByText(/Tambah Soal Baru/i)).not.toBeInTheDocument();
      
      // List should now have 4 items
      expect(screen.getAllByTitle('Hapus').length).toBe(4);
    });
    
    it('opens confirmation modal and deletes a Soal', () => {
      render(<ManageSoal />);
      
      expect(screen.getByText('S-101')).toBeInTheDocument();
      
      const deleteButtons = screen.getAllByTitle('Hapus');
      fireEvent.click(deleteButtons[0]);
      
      // Modal should appear
      expect(screen.getByText(/Apakah kamu yakin ingin menghapus master soal ini/i)).toBeInTheDocument();
      
      const confirmBtn = screen.getByText(/Hapus Permanen/i);
      fireEvent.click(confirmBtn);
      
      // S-101 should be deleted
      expect(screen.queryByText('S-101')).not.toBeInTheDocument();
    });
  });
});
