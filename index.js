// == ROUTE: Validate UUID & IP lock with IP update allowed ==
app.post('/validate-uuid', (req, res) => {
  const { uuid, clientIP } = req.body;
  if (!uuid || !clientIP) return res.status(400).json({ valid: false, message: '❌ Missing UUID or IP.' });

  const uuids = loadUUIDs();
  const data = uuids[uuid];

  if (!data) return res.status(404).json({ valid: false, message: '❌ UUID not found.' });

  if (data.ip === null) {
    // First time login, lock IP
    data.ip = clientIP;
    uuids[uuid] = data;
    saveUUIDs(uuids);
    return res.json({ valid: true, message: '✅ UUID validated and IP locked.' });
  }

  if (data.ip !== clientIP) {
    // IP changed, update to new IP
    data.ip = clientIP;
    uuids[uuid] = data;
    saveUUIDs(uuids);
    return res.json({ valid: true, message: '✅ IP updated to new IP.' });
  }

  // Same IP, verified
  return res.json({ valid: true, message: '✅ UUID verified with same IP.' });
});
