import pool from "../config/db.js"; // Add this import

export const createOrder = async (req, res) => {
  try {
    const { customerName, address, contactNo, email, city, pincode, state } = req.body;

    // Validation
    if (!customerName || !address || !contactNo) {
      return res.status(400).json({
        success: false,
        error: "customerName, address, and contactNo are required fields"
      });
    }

    // Generate values
    const id = Math.floor(10000 + Math.random() * 90000);
    const orderid = `WOWKID${id}`;
    const orderDate = new Date().toISOString();
    
    // Create comprehensive order metadata
    const orderMetaDetails = {
      customerName,
      address,
      contactNo,
      email: email || `customer${id}@example.com`,
      city: city || "Mumbai",
      pincode: pincode || "400001",
      state: state || "Maharashtra",
      orderDate,
      paymentMethod: "Online",
      deliveryType: "Standard"
    };

    // Check if table exists and create if needed (optional - remove in production)
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS suborder_details (
        id INTEGER PRIMARY KEY,
        orderid VARCHAR(50) UNIQUE NOT NULL,
        ordermetaddetails JSONB NOT NULL,
        status VARCHAR(20) DEFAULT 'CONFIRMED',
        amount DECIMAL(10,2) DEFAULT 0.00,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    await pool.query(createTableQuery);

    // Add missing columns if they don't exist (for existing tables)
    const alterTableQueries = [
      `ALTER TABLE suborder_details ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'CONFIRMED';`,
      `ALTER TABLE suborder_details ADD COLUMN IF NOT EXISTS amount DECIMAL(10,2) DEFAULT 0.00;`,
      `ALTER TABLE suborder_details ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;`,
      `ALTER TABLE suborder_details ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;`
    ];

    for (const query of alterTableQueries) {
      try {
        await pool.query(query);
      } catch (alterError) {
        // Ignore errors for columns that already exist
        if (alterError.code !== '42701') { // 42701 = column already exists
          console.error('Error altering table:', alterError);
        }
      }
    }

    // Insert order
    const insertQuery = `
      INSERT INTO suborder_details (id, orderid, ordermetaddetails, status, amount, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;

    const values = [
      id,
      orderid,
      JSON.stringify(orderMetaDetails),
      "CONFIRMED",
      parseFloat((Math.random() * 1000 + 100).toFixed(2)), // Random amount between 100-1100
      orderDate,
      orderDate
    ];

    const { rows } = await pool.query(insertQuery, values);

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: {
        id: rows[0].id,
        orderid: rows[0].orderid,
        ordermetaddetails: rows[0].ordermetaddetails,
        status: rows[0].status,
        amount: rows[0].amount,
        created_at: rows[0].created_at
      }
    });

  } catch (error) {
    console.error("Error creating order:", error);
    
    // Handle duplicate key error
    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        error: "Order ID already exists. Please try again."
      });
    }

    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};