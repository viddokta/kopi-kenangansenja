document.addEventListener('alpine:init', () => {
    Alpine.data('products', () => ({
        items: [{
                id: 1,
                name: 'Robusta Dampit',
                img: 'img2.png',
                price: '120000'
            },
            {
                id: 2,
                name: 'Robusta Puntang',
                img: 'img3.png',
                price: '85000'
            },
            {
                id: 3,
                name: 'Robusta Malabar',
                img: 'img4.png',
                price: '70000'
            },
            {
                id: 4,
                name: 'Robusta Solok',
                img: 'img5.png',
                price: '50000'
            },
            {
                id: 5,
                name: 'Robusta Tolu Batak',
                img: 'img6.png',
                price: '129000'
            },
            {
                id: 6,
                name: 'Robusta Jawa Ciwidey',
                img: 'img7.png',
                price: '57000'
            },
            {
                id: 7,
                name: 'Robusta Lintong',
                img: 'img8.png',
                price: '65000'
            },
            {
                id: 8,
                name: 'Robusta Flores',
                img: 'img9.png',
                price: '57000'
            },
            {
                id: 9,
                name: 'Robusta Mt. Ijen',
                img: 'img10.png',
                price: '52000'
            },
        ],
    }));

    Alpine.store('cart', {
        items: [],
        total: 0,
        quantity: 0,
        add(newItem) {
            const existingItem = this.items.find(item => item.id === newItem.id);

            if (existingItem) {
                existingItem.quantity++;
            } else {
                this.items.push({
                    ...newItem,
                    quantity: 1
                });
            }

            this.quantity++;
            this.total += newItem.price;
        },
        remove(itemId) {
            const index = this.items.findIndex(item => item.id === itemId);

            if (index !== -1) {
                const removedItem = this.items[index];

                if (removedItem.quantity > 1) {
                    removedItem.quantity--;
                } else {
                    this.items.splice(index, 1);
                }

                this.quantity--;
                this.total -= removedItem.price;
            }
        },
    });
});

// Konversi ke Rupiah
const rupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(number);
};

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('checkoutForm');
    const checkoutButton = document.getElementById('checkout-button');

    form.addEventListener('submit', async function(e) {
        // Lakukan validasi formulir sebelum mengirimkan data
        if (!form.checkValidity()) {
            // Jika formulir tidak valid, hentikan pengiriman formulir
            e.preventDefault();
            return;
        }

        // Dapatkan nilai input dari formulir
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const items = JSON.parse(document.getElementById('items').value);

        // Hitung total harga dari daftar produk
        const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

        // Ambil detail nama produk, quantity, dan total harga per item dari daftar produk
        const productDetails = items.map(item => `${item.name} (Quantity: ${item.quantity}, Total Harga: ${rupiah(item.price * item.quantity)})`);

        // Format pesan dengan baris baru (\n) untuk membuatnya terstruktur
        const whatsappMessage = `Halo, saya ingin melakukan pemesanan produk kopi.\n\n` +
            `Nama: ${name}\n` +
            `Email: ${email}\n` +
            `No. Telepon: ${phone}\n\n` +
            `Daftar Products:\n${productDetails.join('\n')}\n\n` +
            `Total Harga: ${rupiah(total)}\n`; // Menggunakan fungsi rupiah untuk format total harga

        // Nomor WhatsApp tujuan
        const whatsappNumber = '6281398221795'; // Ganti dengan nomor tujuan yang sesuai

        // Membuat deep link untuk membuka WhatsApp
        const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

        // Arahkan pengguna ke WhatsApp
        window.location.href = whatsappLink;

        // Hentikan pengiriman formulir ke server
        e.preventDefault();
    });

    // Tambahkan event listener untuk setiap perubahan pada formulir
    form.addEventListener('input', function() {
        // Periksa apakah semua input telah diisi
        const isFormFilled = isInputFilled('name') &&
            isInputFilled('email') &&
            isInputFilled('phone');

        // Atur properti disabled pada tombol Checkout
        checkoutButton.disabled = !isFormFilled;
    });

    // Fungsi untuk memeriksa apakah input sudah diisi
    function isInputFilled(inputId) {
        const input = document.getElementById(inputId);
        return input.value.trim() !== '';
    }
});