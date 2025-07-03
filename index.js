app.post('/save', async (req, res) => {
  try {
    const data = req.body;
    const timestamp = new Date().toISOString();

    console.log("📥 Incoming memory:", data); // Add this line

    const content = `
🧠 C.R.O.A.K. Memory Snapshot
⏰ Time: ${timestamp}

📝 MEMORY:
${JSON.stringify(data.memory, null, 2)}
    `;

    await transporter.sendMail({
      from: `"CroakBot Memory" <${EMAIL_USER}>`,
      to: EMAIL_USER,
      subject: `CroakBot Memory Dump - ${timestamp}`,
      text: 'Attached is the latest CroakBot memory snapshot.',
      attachments: [
        {
          filename: `croak-memory-${timestamp}.txt`,
          content: content
        }
      ]
    });

    console.log('✅ Email with .txt attachment sent');
    res.json({ status: 'success', message: 'Email with attachment sent' });
  } catch (e) {
    console.error('❌ Error saving memory:', e.message);
    res.status(500).json({ status: 'error', message: e.message });
  }
});
