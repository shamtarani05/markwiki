const mongoose = require('mongoose');

async function resetDB() {
    await mongoose.connect('mongodb://127.0.0.1:27017/markwiki');
    
    // Using strict: false so we don't need the full schema
    const SiteConfig = mongoose.model('SiteConfig', new mongoose.Schema({}, { strict: false }));
    
    const result = await SiteConfig.findOneAndUpdate(
        {},
        { $set: { 'homepage.sections': [] } },
        { new: true }
    );
    
    console.log("DB Reset result:", result);
    process.exit(0);
}

resetDB().catch(err => {
    console.error(err);
    process.exit(1);
});
