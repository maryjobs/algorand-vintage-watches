from pyteal import *


class Watch:
    class Variables:
        name = Bytes("NAME") # byte
        image = Bytes("IMAGE") # byte
        description = Bytes("DESCRIPTION")  # byte
        price = Bytes("PRICE")# uint
        owner = Bytes("OWNER")# byte
        forSale = Bytes("FORSALE") # uint
        

    class AppMethods:
        buy = Bytes("buy")
        changeimage = Bytes("changeimage")
        changedescription = Bytes("changedescription")
        toggleSale = Bytes("toggleSale")
       


    def application_creation(self):
        return Seq([
            Assert(
                And(
                    # check to make sure the number of arguments is exactly 4
                    Txn.application_args.length() == Int(4),

                    Txn.note() == Bytes("watch_marketplace:uv3"),
                    # checks to make sure the arguments are valid and not null
                    Len(Txn.application_args[0]) > Int(0),
                    Len(Txn.application_args[1]) > Int(0),
                    Len(Txn.application_args[2]) > Int(0),
                    Btoi(Txn.application_args[3]) > Int(0),
                )
            ), 

            # Store the transaction arguments into the applications's global's state
            App.globalPut(self.Variables.name, Txn.application_args[0]),
            App.globalPut(self.Variables.image, Txn.application_args[1]),
            App.globalPut(self.Variables.description, Txn.application_args[2]),
            App.globalPut(self.Variables.price, Btoi(Txn.application_args[3])),
            App.globalPut(self.Variables.owner, Txn.sender()),
            App.globalPut(self.Variables.forSale, Int(1)),

            Approve(),
        ])

 # buy function. Users can buy watches from the marketplace
    def buy(self):
            count = Txn.application_args[1]
            valid_number_of_transactions = Global.group_size() == Int(2)

            valid_payment_to_seller = And(
                Gtxn[1].type_enum() == TxnType.Payment,
                Gtxn[1].receiver() == App.globalGet(self.Variables.owner),
                Gtxn[1].amount() == App.globalGet(self.Variables.price),
                Gtxn[1].sender() == Gtxn[0].sender(),
            )

            can_buy = And(valid_number_of_transactions, App.globalGet(self.Variables.forSale) == Int(1),
                        valid_payment_to_seller)

            update_state = Seq([
                App.globalPut(self.Variables.forSale, Int(0)),
                Approve()
            ])

            return If(can_buy).Then(update_state).Else(Reject())

    
# users can change the description of their watch 
    def changedescription(self):
        Assert(
            And(
                   
                    Len(Txn.application_args[1]) > Int(0),
                    Txn.sender() == App.globalGet(self.Variables.owner),
                    Txn.application_args.length() == Int(2),
            ),
        ),
        return Seq([
            App.globalPut(self.Variables.description, Txn.application_args[1]),
            Approve()
        ])


# users can toggle the sale of their watch listing
    def toggleSale(self):
        return Seq([
            Assert(Txn.sender() == App.globalGet(self.Variables.owner)),
            If(App.globalGet(self.Variables.forSale) == Int(0)).Then(App.globalPut(
                self.Variables.forSale, Int(1))).Else(App.globalPut(self.Variables.forSale, Int(0))),
            Approve()
        ])

# users can change the image of their watch
    def changeimage(self):
        Assert(
            And(
                    Len(Txn.application_args[1]) > Int(0),
                    Txn.sender() == App.globalGet(self.Variables.owner),
                    Txn.application_args.length() == Int(2),
            ),
        ),
        return Seq([
            App.globalPut(self.Variables.image, Txn.application_args[1]),
            Approve()
        ])


    # To delete a picture.
    def application_deletion(self):
        return Return(Txn.sender() == App.globalGet(self.Variables.owner),)

    # Check transaction conditions
    def application_start(self):
        return Cond(
            # checks if the application_id field of a transaction matches 0.
            # If this is the case, the application does not exist yet, and the application_creation() method is called
            [Txn.application_id() == Int(0), self.application_creation()],
            # If the the OnComplete action of the transaction is DeleteApplication, the application_deletion() method is called
            [Txn.on_completion() == OnComplete.DeleteApplication,
             self.application_deletion()],
            # if the first argument of the transaction matches the AppMethods.buy value, the buy() method is called.
            
            [Txn.application_args[0] == self.AppMethods.buy, self.buy()],
            [Txn.application_args[0] == self.AppMethods.changeimage, self.changeimage()],
            [Txn.application_args[0] == self.AppMethods.changedescription, self.changedescription()],
            [Txn.application_args[0] == self.AppMethods.toggleSale, self.toggleSale()],
        )

    # The approval program is responsible for processing all application calls to the contract.
    def approval_program(self):
        return self.application_start()

    # The clear program is used to handle accounts using the clear call to remove the smart contract from their balance record.
    def clear_program(self):
        return Return(Int(1))