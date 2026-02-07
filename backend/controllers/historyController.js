import History from '../models/History.js';

export const getHistory = async (req, res) => {
    try {
        const history = await History.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const clearHistory = async (req, res) => {
    try {
        await History.deleteMany({ user: req.user._id });
        res.json({ message: 'History cleared' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
