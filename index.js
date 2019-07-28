let foot_list = ["chocolate", "chocolates"];
let medical_list = ["pills"];
let book_list = ["books", "book"];
let BasicTaxRate = 10.0;
let ImportedTaxRate = 5.0;
//========================================================================
// Parse to break input to components
let ItemParser = function() {
  let inputRegex = "(\\d+) ([\\w\\s]* )at (\\d+.\\d{2})";

  ItemParser.prototype.ItemSplitter = function(item) {
    let regex = inputRegex;
    let match = item.match(regex);
    if (match && match.length > 1) {
      let quantity = parseInt(match[1].trim());
      let itemName = match[2].trim();
      let price = parseFloat(match[3].trim());
      let shop = ShopingCartItem({
        Quantity: quantity,
        Product: Product({
          Name: itemName,
          ShelfPrice: price
        })
      });
      return shop;
    }
    return null;
  };
};
// Parse to break input to components
//========================================================================
//ShopingCart class to Save Each shorping cart Item
let ShopingCart = function(cartItems) {
  let TotalTax = function() {
    let tax = 0;
    cartItems.forEach(cartItem => {
      tax += cartItem.Tax;
    });
    return parseFloat(Number(tax).toFixed(2));
  };
  let TotalCost = function() {
    let cost = 0;
    cartItems.forEach(cartItem => {
      cost += cartItem.Cost();
    });
    return parseFloat(Number(cost).toFixed(2));
  };
  return {
    cartItems,
    TotalTax,
    TotalCost
  };
};
//ShopingCart class to Save Each shorping cart Item
//========================================================================
//Shoping Cart Item With the properties Product detials, Quantity, Tax, Cost
let ShopingCartItem = function(cardItem) {
  let Product = cardItem.Product;
  let Quantity = cardItem.Quantity;
  let Tax = cardItem.Tax;
  let Cost = function() {
    return parseFloat(
      Number(this.Quantity * (this.Tax + this.Product.ShelfPrice)).toFixed(2)
    );
  };
  return {
    Product,
    Quantity,
    Tax,
    Cost
  };
};
//========================================================================
//Product details for each item on the receipt. (ShelfPrice,Name,IsImported,IsOf)
let Product = function(product) {
  let ShelfPrice = product.ShelfPrice;
  let Name = product.Name;
  let IsImported = product.Name.indexOf("imported") != -1;
  let IsOf = function() {
    let isExempt = false;
    let expItems = [...foot_list, ...medical_list, ...book_list];
    expItems.forEach(item => {
      if (product.Name.indexOf(item) != -1 && !isExempt) {
        isExempt = true;
      }
    });
    return isExempt;
  };
  return {
    Name,
    ShelfPrice,
    IsImported,
    IsOf
  };
};
//============================================================
// TaxCalculator To calculate tax
let TaxCalculator = function(shopingCart) {
  let Calculate = function() {
    let calculator = new SalesTax();
    shopingCart.cartItems.forEach(cartItem => {
      cartItem.Tax = calculator.CalculateTax(cartItem.Product);
    });
  };
  return {
    Calculate
  };
};
//============================================================
let SalesTax = function() {
  let Calculate = function(Rate, ShelfPrice) {
    //sales tax are that for a tax rate of n%, a shelf price of p contains (np/100)
    var tax = (ShelfPrice * Rate) / 100;
    return tax;
  };
  let CalculateTax = function(product) {
    var tax = 0;
    if (!product.IsOf()) {
      tax += Calculate(BasicTaxRate, product.ShelfPrice);
    }
    if (product.IsImported) {
      tax += Calculate(ImportedTaxRate, product.ShelfPrice);
    }
    //The rounding rules: rounded up to the nearest 0.05
    tax = parseFloat(Number(Math.ceil(tax / 0.05) * 0.05).toFixed(2));
    return tax;
  };
  return {
    CalculateTax
  };
};
//============================================================
let ShopingCartPrinter = {
  Print: function(shopingCart) {
    shopingCart.cartItems.forEach(cartItem => {
      console.log(
        `${cartItem.Quantity} ${cartItem.Product.Name}: ${cartItem.Cost()}`
      );
    });
    console.log(`Taxes: ${shopingCart.TotalTax()}`);
    console.log(`Total: ${shopingCart.TotalCost()}`);
  }
};
//============================================================
let Program = function() {
  Program.prototype.ProcessInput = function(input) {
    // console.log("input", input);
    let itemParser = new ItemParser();
    let cartItems = [];
    input.forEach(item => {
      cartItems.push(itemParser.ItemSplitter(item));
    });
    let shopingCart = new ShopingCart(cartItems);
    let taxCalculator = new TaxCalculator(shopingCart);
    taxCalculator.Calculate();
    ShopingCartPrinter.Print(shopingCart);
  };
};
//============================================================
let p = new Program();
//Your input goes here
let input = [
  "1 imported bottle of perfume at 27.99",
  "1 bottle of perfume at 18.99",
  "1 packet of headache pills at 9.75",
  "1 box of imported chocolates at 11.25"
];
p.ProcessInput(input);
