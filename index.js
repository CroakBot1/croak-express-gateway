let lastSnapshot = null;

app.post('/save', async (req, res) => {
  try {
    const data = req.body;
    const timestamp = new Date().toISOString();

    lastSnapshot = {
      timestamp,
      memory: data.memory
    };

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

    res.json({ status: 'success', message: 'Memory captured and emailed.', snapshot: lastSnapshot });
  } catch (e) {
    console.error('❌ Error saving memory:', e.message);
    res.status(500).json({ status: 'error', message: e.message });
  }
});
