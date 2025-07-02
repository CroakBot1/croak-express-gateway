app.post('/save', async (req, res) => {
  try {
    const { memory, timestamp } = req.body;

    if (!memory || Object.keys(memory).length === 0) {
      return res.status(400).json({ error: 'No memory provided' });
    }

    const data = {
      timestamp: timestamp || new Date().toISOString(),
      memory
    };

    const filename = `memory-${Date.now()}.json`;
    const filepath = path.join(__dirname, filename);

    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));

    // ✅ Send email with memory file
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'apploverss3@gmail.com',
        pass: 'logirdljgwttuorv'
      }
    });

    const mailOptions = {
      from: 'Croak Bot Server <apploverss3@gmail.com>',
      to: 'apploverss3@gmail.com',
      subject: `🧠 Croak Bot Memory Snapshot - ${new Date().toLocaleString()}`,
      text: `Attached is the latest memory snapshot from Croak Bot.`,
      attachments: [{ filename, path: filepath }]
    };

    await transporter.sendMail(mailOptions);

    // ✅ Delete file after sending
    fs.unlinkSync(filepath);

    res.json({ status: '✅ Memory saved, emailed, and cleaned' });

  } catch (err) {
    console.error("❌ Error saving memory:", err);
    res.status(500).json({ error: 'Failed to process memory' });
  }
});
