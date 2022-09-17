using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MISA.MSHOPKEEPER.WEB022018.Models
{
    public class Product
    {
        private Guid _productID;

        public Guid ProductID
        {
            get { return _productID; }
            set { _productID = value; }
        }

        public string SkuCode { get; set; }

        public string BarCode { get; set; }

        public decimal FirstQuantity { get; set; }

        public string ProductName { get; set; }

        public string GroupProduct { get; set; }

        public string Counter { get; set; }

        public decimal ImportPrice { get; set; }

        public decimal Price { get; set; }

        public string DisplayOnScreen { get; set; }

        public string Category { get; set; }

        public int MinQuantity { get; set; }

        public int MaxQuantity { get; set; }

        public string StockPosition { get; set; }

        public string DisplayPosition { get; set; }

        public string Status { get; set; }
        public string Description { get; set; }

        public static List<Product> GetProducts = new List<Product>()
        {
            new Product {SkuCode="AB01", ProductID = Guid.NewGuid(), BarCode="123",FirstQuantity=10, ProductName ="Quần jean nữ", GroupProduct="Quần nữ", Counter="Chiếc",ImportPrice= 200000, Price=250234, DisplayOnScreen="Có", Category="Hàng hóa", MinQuantity=1, MaxQuantity = 80, StockPosition="Tầng 1",DisplayPosition="Khu A", Status="Đang kinh doanh",Description="Không có"},
            new Product {SkuCode="AB02", ProductID = Guid.NewGuid(),BarCode="3354",FirstQuantity=5, ProductName ="Áo len nữ croptop", GroupProduct="Áo len", Counter="Chiếc",ImportPrice= 200000, Price=425362, DisplayOnScreen="Có", Category="Hàng hóa", MinQuantity=1, MaxQuantity = 100,StockPosition="Tầng 1",DisplayPosition="Khu A", Status="Đang kinh doanh",Description="Không có"},
            new Product {SkuCode="AB03", ProductID = Guid.NewGuid(), BarCode="123",FirstQuantity=5,ProductName ="Áo len nữ croptop", GroupProduct="Áo len", Counter="Chiếc",ImportPrice= 200000, Price=250738, DisplayOnScreen="Không", Category="Hàng hóa", MinQuantity=1, MaxQuantity = 100,StockPosition="Tầng 1",DisplayPosition="Khu A", Status="Ngừng kinh doanh",Description="Không có"},
            new Product {SkuCode="ABC02", ProductID = Guid.NewGuid(),BarCode="32435",FirstQuantity=5, ProductName ="Quần jean nam", GroupProduct="Áo len", Counter="Cái",ImportPrice= 200000, Price=325000, DisplayOnScreen="Có", Category="Hàng hóa", MinQuantity=1, MaxQuantity = 100,StockPosition="Tầng 1",DisplayPosition="Khu A", Status="Đang kinh doanh",Description="Không có"},
            new Product {SkuCode="AB01", ProductID = Guid.NewGuid(),BarCode="123",FirstQuantity=5, ProductName ="Áo len nữ croptop", GroupProduct="Áo len", Counter="Cái",ImportPrice= 200000, Price=253029, DisplayOnScreen="Không", Category="Hàng hóa", MinQuantity=1, MaxQuantity = 100,StockPosition="Tầng 1",DisplayPosition="Khu A", Status="Ngừng kinh doanh",Description="Không có"},
            new Product {SkuCode="ABD01", ProductID = Guid.NewGuid(),BarCode="123",FirstQuantity=5, ProductName ="Áo sơm mi nam", GroupProduct="Áo len", Counter="Chiếc",ImportPrice= 200000, Price=253000, DisplayOnScreen="Không", Category="Hàng hóa", MinQuantity=1, MaxQuantity = 100,StockPosition="Tầng 1",DisplayPosition="Khu A", Status="Ngừng kinh doanh",Description="Không có"},
            new Product {SkuCode="ABD02", ProductID = Guid.NewGuid(), BarCode="123",FirstQuantity=5,ProductName ="Áo len nam", GroupProduct="Áo len", Counter="Cái",ImportPrice= 200000, Price=250000, DisplayOnScreen="Có", Category="Hàng hóa", MinQuantity=1, MaxQuantity = 100,StockPosition="Tầng 1",DisplayPosition="Khu A", Status="Đang kinh doanh",Description="Không có"},
            new Product {SkuCode="AB01", ProductID = Guid.NewGuid(),BarCode="0021",FirstQuantity=5, ProductName ="Áo len nam 2019", GroupProduct="Áo len", Counter="Cái",ImportPrice= 200000, Price=250000, DisplayOnScreen="Có", Category="Hàng hóa",MinQuantity=1, MaxQuantity = 100,StockPosition="Tầng 1",DisplayPosition="Khu A", Status="Đang kinh doanh",Description="Không có"},
            new Product {SkuCode="AB01", ProductID = Guid.NewGuid(),BarCode="123",FirstQuantity=5, ProductName ="Áo phông nam 2019", GroupProduct="Áo len", Counter="Bộ",ImportPrice= 200000, Price=12250000, DisplayOnScreen="Có", Category="Hàng hóa",MinQuantity=1, MaxQuantity = 100,StockPosition="Tầng 1",DisplayPosition="Khu A", Status="Đang kinh doanh",Description="Không có"},
            new Product {SkuCode="AB01", ProductID = Guid.NewGuid(),BarCode="123",FirstQuantity=5, ProductName ="Áo len nữ croptop", GroupProduct="Áo len", Counter="Set",ImportPrice= 200000, Price=2350000, DisplayOnScreen="Có", Category="Hàng hóa",MinQuantity=1, MaxQuantity = 100,StockPosition="Tầng 1",DisplayPosition="Khu A", Status="Đang kinh doanh",Description="Không có"},
            new Product {SkuCode="AB01", ProductID = Guid.NewGuid(),BarCode="123",FirstQuantity=5, ProductName ="Quần âu nam", GroupProduct="Áo len", Counter="Cái",ImportPrice= 200000, Price=550000, DisplayOnScreen="Có", Category="Hàng hóa",MinQuantity=1, MaxQuantity = 20,StockPosition="Tầng 2",DisplayPosition="Khu A", Status="Ngừng kinh doanh",Description="Không có"},
            new Product {SkuCode="AB01", ProductID = Guid.NewGuid(),BarCode="123",FirstQuantity=5, ProductName ="Áo phông nam", GroupProduct="Áo len", Counter="Chiếc",ImportPrice= 200000, Price=250000, DisplayOnScreen="Có", Category="Hàng hóa",MinQuantity=1, MaxQuantity = 100,StockPosition="Tầng 1",DisplayPosition="Khu A", Status="Đang kinh doanh",Description="Không có"},
            new Product {SkuCode="AB01", ProductID = Guid.NewGuid(),BarCode="456",FirstQuantity=5, ProductName ="Áo len nữ croptop", GroupProduct="Áo len", Counter="Cái",ImportPrice= 200000, Price=250000, DisplayOnScreen="Có", Category="Hàng hóa",MinQuantity=1, MaxQuantity = 100,StockPosition="Tầng 1",DisplayPosition="Khu A", Status="Ngừng kinh doanh",Description="Không có"},
            new Product {SkuCode="AB01", ProductID = Guid.NewGuid(),BarCode="123",FirstQuantity=5, ProductName ="Áo vest nam", GroupProduct="Áo len", Counter="Chiếc",ImportPrice= 200000, Price=165000, DisplayOnScreen="Không", Category="Hàng hóa",MinQuantity=1, MaxQuantity = 100,StockPosition="Tầng 2",DisplayPosition="Khu A", Status="Đang kinh doanh",Description="Không có"},
            new Product {SkuCode="AB01", ProductID = Guid.NewGuid(),BarCode="123",FirstQuantity=5, ProductName ="Bộ vest nam", GroupProduct="Áo len", Counter="Bộ",ImportPrice= 200000, Price=250000, DisplayOnScreen="Có", Category="Hàng hóa",MinQuantity=1, MaxQuantity = 55,StockPosition="Tầng 1",DisplayPosition="Khu A", Status="Đang kinh doanh",Description="Không có"},
            new Product {SkuCode="AB01", ProductID = Guid.NewGuid(),BarCode="334",FirstQuantity=5, ProductName ="Áo len nữ croptop", GroupProduct="Áo len", Counter="Miếng",ImportPrice= 200000, Price=250000, DisplayOnScreen="Không", Category="Hàng hóa",MinQuantity=1, MaxQuantity = 100,StockPosition="Tầng 3",DisplayPosition="Khu A", Status="Đang kinh doanh",Description="Không có"},
            new Product {SkuCode="AB01", ProductID = Guid.NewGuid(),BarCode="12334",FirstQuantity=5, ProductName ="Áo len nữ", GroupProduct="Áo len nữ", Counter="Chiếc",ImportPrice= 200000, Price=250000, DisplayOnScreen="Có", Category="Hàng hóa",MinQuantity=1, MaxQuantity = 48,StockPosition="Tầng 1",DisplayPosition="Khu C", Status="Ngừng kinh doanh",Description="Không có"},
            new Product {SkuCode="AB01", ProductID = Guid.NewGuid(),BarCode="645",FirstQuantity=5, ProductName ="Áo len nữ croptop", GroupProduct="Áo len", Counter="Miếng",ImportPrice= 200000, Price=250000, DisplayOnScreen="Có", Category="Hàng hóa",MinQuantity=1, MaxQuantity = 100,StockPosition="Tầng 1",DisplayPosition="Khu A", Status="Đang kinh doanh",Description="Không có"},
            new Product {SkuCode="AB01", ProductID = Guid.NewGuid(),BarCode="123",FirstQuantity=5, ProductName ="Áo len nữ croptop", GroupProduct="Áo len", Counter="Chiếc",ImportPrice= 200000, Price=250000, DisplayOnScreen="Không", Category="Hàng hóa",MinQuantity=1, MaxQuantity = 100,StockPosition="Tầng 2",DisplayPosition="Khu A", Status="Đang kinh doanh",Description="Không có"},
            new Product {SkuCode="AB01", ProductID = Guid.NewGuid(),BarCode="112",FirstQuantity=5, ProductName ="Áo len nữ croptop", GroupProduct="Áo len", Counter="Cái",ImportPrice= 200000, Price=250000, DisplayOnScreen="Không", Category="Hàng hóa",MinQuantity=1, MaxQuantity = 74,StockPosition="Tầng 2",DisplayPosition="Khu A", Status="Đang kinh doanh",Description="Không có"},
            new Product {SkuCode="AB01", ProductID = Guid.NewGuid(),BarCode="123",FirstQuantity=5, ProductName ="Quần lửng nam", GroupProduct="Áo len", Counter="Bộ",ImportPrice= 200000, Price=255000, DisplayOnScreen="Có", Category="Hàng hóa",MinQuantity=1, MaxQuantity = 100,StockPosition="Tầng 1",DisplayPosition="Khu B", Status="Đang kinh doanh",Description="Không có"},
            new Product {SkuCode="AB01", ProductID = Guid.NewGuid(),BarCode="123",FirstQuantity=5, ProductName ="Áo sơ mi 2019", GroupProduct="Áo len", Counter="Set",ImportPrice= 200000, Price=350000, DisplayOnScreen="Có", Category="Hàng hóa",MinQuantity=1, MaxQuantity = 88,StockPosition="Tầng 3",DisplayPosition="Khu A", Status="Đang kinh doanh",Description="Không có"},
            new Product {SkuCode="AB01", ProductID = Guid.NewGuid(),BarCode="123",FirstQuantity=5, ProductName ="Áo cộc nữ", GroupProduct="Áo len", Counter="Chiếc",ImportPrice= 200000, Price=442000, DisplayOnScreen="Không", Category="Hàng hóa",MinQuantity=1, MaxQuantity = 100,StockPosition="Tầng 1",DisplayPosition="Khu A", Status="Đang kinh doanh",Description="Không có"},
            new Product {SkuCode="AB01", ProductID = Guid.NewGuid(),BarCode="123",FirstQuantity=5, ProductName ="Áo len nữ croptop", GroupProduct="Áo len", Counter="Chiếc",ImportPrice= 200000, Price=250000, DisplayOnScreen="Có", Category="Hàng hóa",MinQuantity=1, MaxQuantity = 90,StockPosition="Tầng 1",DisplayPosition="Khu C", Status="Đang kinh doanh",Description="Không có"}
        };
    }
}