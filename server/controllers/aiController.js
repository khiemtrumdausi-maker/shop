const { GoogleGenerativeAI } = require("@google/generative-ai");
const db = require("../config/db");

// Khởi tạo Gemini - Đảm bảo đã có process.env.GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.chatWithAI = async (req, res) => {
    try {
        const { message } = req.body;

        // Kiểm tra nếu khách chưa nhập gì
        if (!message) {
            return res.status(400).json({ reply: "Bạn cần nhập nội dung tin nhắn nhé!" });
        }

        // 1. Lấy dữ liệu sản phẩm (Sửa tên cột cho đúng với file ProductModel.js của bạn)
        // Lưu ý: Tên bảng 'products' và 'categories' phải khớp trong MySQL
        const [products] = await db.execute(`
            SELECT p.ProductName, p.Price, p.Description, c.CategoryName 
            FROM products p
            LEFT JOIN categories c ON p.CategoryID = c.CategoryID
            WHERE p.Status = 'Active'
        `);

        // 2. Cấu hình model Gemini
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            generationConfig: {
                maxOutputTokens: 500,
                temperature: 0.7,
            },
        });

        // 3. Xây dựng ngữ cảnh (Prompt)
        const prompt = `
            Bạn là trợ lý ảo bán hàng thông minh của "Shop Quần Áo Khiêm" (CGK Shop).
            Dưới đây là danh sách sản phẩm hiện có trong cửa hàng:
            ${JSON.stringify(products)}

            Nhiệm vụ của bạn:
            - Trả lời bằng tiếng Việt, phong cách thân thiện, chuyên nghiệp.
            - Tư vấn sản phẩm phù hợp dựa trên yêu cầu của khách hàng.
            - Nếu khách hỏi về sản phẩm có trong danh sách, hãy nêu tên và giá (Ví dụ: 200,000 VND).
            - Nếu không có đúng sản phẩm đó, hãy khéo léo gợi ý các mẫu khác tương tự.
            - Tuyệt đối không tự bịa ra sản phẩm không có trong danh sách trên.
            
            Câu hỏi của khách: "${message}"
        `;

        // 4. Gọi Gemini xử lý
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // 5. Trả kết quả về cho Frontend
        res.json({ reply: text });

    } catch (error) {
        // Ghi log lỗi chi tiết ra Terminal của server để Khiêm dễ soi
        console.error("--- LỖI AI CONTROLLER ---");
        console.error(error.message);
        
        // Trả về lỗi 500 kèm thông tin lỗi (nếu cần debug)
        res.status(500).json({ 
            error: "Hic, server AI đang bận một chút.",
            details: error.message 
        });
    }
};