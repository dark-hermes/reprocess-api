/**
 * File: pb_hooks/admin-ui-button.js
 *
 * Script ini akan menambahkan tombol "Generate Recommendations"
 * di halaman detail record 'waste' pada Admin UI.
 */
$hooks.onRecordViewRequest((e) => {
  // Hanya jalankan jika kita sedang melihat record dari koleksi 'waste'
  if (e.collection.name !== 'waste') {
    return;
  }

  // Buat tombol baru
  const button = document.createElement('button');
  button.innerHTML = '<i class="ri-magic-line"></i> Generate Recommendations';
  button.classList.add('btn', 'btn-secondary');

  // Tambahkan tombol ke header halaman
  const header = document.querySelector('.record-header');
  if (header) {
    header.appendChild(button);
  }

  // Tambahkan event listener untuk tombol
  button.addEventListener('click', async () => {
    button.innerHTML = '<i class="ri-loader-4-line spin"></i> Generating...';
    button.disabled = true;

    try {
      // Panggil endpoint backend. PASTIKAN EJAAN DI SINI BENAR.
      const response = await pb.send(
        `/api/generate-recommendations/${e.record.id}` // <-- PERBAIKI DI SINI
      );

      // Tampilkan hasil
      let choiceText = 'Pilih Aksi:\n\n';
      response.candidates[0].content.parts[0].text.forEach((rec, index) => {
        choiceText += `${index + 1}. [${rec.category.toUpperCase()}] ${
          rec.description
        }\n`;
      });

      const userChoice = parseInt(
        prompt(choiceText, 'Masukkan nomor (1, 2, atau 3)')
      );

      if (userChoice >= 1 && userChoice <= 3) {
        const chosenAction = response.candidates[0].content.parts[0].text[userChoice - 1];

        // Simpan aksi yang dipilih ke koleksi 'actions'
        await pb.collection('actions').create({
            'waste_id': e.record.id,
            'category': chosenAction.category,
            'description': chosenAction.description,
            'benefit': chosenAction.benefit,
            'point': chosenAction.point,
            'quantity': e.record.quantity,
            'finished': false
        });

        alert(`Aksi "${chosenAction.category}" berhasil disimpan! Silakan refresh halaman.`);
      }

    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      button.innerHTML = '<i class="ri-magic-line"></i> Generate Recommendations';
      button.disabled = false;
    }
  });
});