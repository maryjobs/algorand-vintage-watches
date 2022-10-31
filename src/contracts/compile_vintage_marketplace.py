from pyteal import *

from vintage_marketplace_contract import Watch

if __name__ == "__main__":
    approval_program = Watch().approval_program()
    clear_program = Watch().clear_program()

    # Mode.Application specifies that this is a smart contract
    compiled_approval = compileTeal(approval_program, Mode.Application, version=6)
    print(compiled_approval)
    with open("vintage_marketplace_contract_approval.teal", "w") as teal:
        teal.write(compiled_approval)
        teal.close()

    # Mode.Application specifies that this is a smart contract
    compiled_clear = compileTeal(clear_program, Mode.Application, version=6)
    print(compiled_clear)
    with open("vintage_marketplace_contract_clear.teal", "w") as teal:
        teal.write(compiled_clear)
        teal.close()
