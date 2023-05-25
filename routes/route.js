const express = require('express');
const Event = require('../models/eventSchema');
const router = express.Router();
const multer = require('multer');
const path = require('path');
router.use(express.static('public'));
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'../public/images'),function(error, success){
            if(error) throw error
        });
    },
    filename:function(req,file,cb){
      const name =  Date.now()+'-'+file.originalname;
      cb(null,name, function(error1, success){
        if(error1) throw error1
      });
    }
});
const upload = multer({storage:storage}) 

// GET /api/v3/app/event?id=:event_id
router.get('/api/v3/app/events', async (req, res) => {
  try {
    const eventId = req.query.id;    
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/v3/app/events?type=latest&limit=5&page=1
router.get('/api/v3/app/events/new', async (req, res) => {
    try {
      console.log(req.query);
      const { type, limit, page } = req.query;
    
      let query = {};
  
      if (type === 'latest') {
        query = {}; 
      }     
      const pageSize = parseInt(limit) || 10; 
      const currentPage = parseInt(page) || 1;   
      const totalEvents = await Event.countDocuments(query);
      const totalPages = Math.ceil(totalEvents / pageSize);  
      const events = await Event.find(query)
        .sort({ schedule: -1 })
        .skip((currentPage - 1) * pageSize) 
        .limit(pageSize);   
      res.json({
        events,
        currentPage,
        totalPages,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
// POST /api/v3/app/events
router.post('/api/v3/app/events', upload.single('image'), async (req, res) => {
    try {
      const { name, tagline, schedule, description, moderator, category, sub_category, rigor_rank } = req.body;
      console.log(req.body);   
      const event = new Event({
        name,
        tagline,
        schedule,
        description,
        moderator,
        category,
        sub_category,
        rigor_rank,
        image: req.file.filename
      });
  
     await event.save();
  
    res.json({ id: data._id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // PUT /api/v3/app/events/:id
router.put('/api/v3/app/events/:id', async (req, res) => {
    try {
      const eventId = req.params.id;
      const { name, tagline, schedule, description, moderator, category, sub_category, rigor_rank } = req.body;
      const image = req.files
      let event = await Event.findById(eventId);
  
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      event.name = name;
      event.tagline = tagline;
      event.schedule = schedule;
      event.description = description;
      event.moderator = moderator;
      event.category = category;
      event.sub_category = sub_category;
      event.rigor_rank = rigor_rank;
  
      if (image) {
        event.image = image;
      }
      event = await event.save();
      let updatedEvent = await Event.findById(eventId);
      res.json(updatedEvent);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

  // DELETE /api/v3/app/events/:id
router.delete('/api/v3/app/events/:id', async (req, res) => {
    try {
      const eventId = req.params.id;
      const deletedEvent = await Event.findByIdAndDelete(eventId);
  
      if (!deletedEvent) {
        return res.status(404).json({ message: 'Event not found' });
      }
  
      res.json({ message: 'Event deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
module.exports = router;